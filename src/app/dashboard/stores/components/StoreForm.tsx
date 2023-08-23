"use client";
import React from "react";
import Image from "next/image";
import { CheckIcon, PencilIcon, PhotoIcon } from "@heroicons/react/24/outline";
import shortid from "shortid";

import {
    copyToClipboard,
    debounce,
    extractCurrencyInBracket,
    generateShopAlias
} from "@lib/common.utils";
import MultiSelectInput, {
    MultiSelectProps
} from "@components/Input/MultiSelectInput";
import FileWidget, { FileWithPreview } from "@components/FileWidget";

//styles
import { getCurrencies, spaceSeparatedStrToPath } from "@lib/format-utils";
import { usePathname, useRouter } from "next/navigation";
import { Breadcrumb } from "@components/Breadcrumb";
import { ImagePicker } from "./ImagePicker";

import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { baseURL, supabaseBuckets, supabaseTables } from "@lib/constants";
import { Store } from "../typing";
import { useGetProductCategories } from "@hooks/useGetProductCategories";
import { Button } from "@components/Button";
import { useGetUser } from "@hooks/useGetUser";
import { toast } from "react-toastify";
import { SavingPrompt } from "./modals/SavingPrompt";
import { Spinner } from "@components/Spinner";

const imagePickerBannerDesc =
    "Customize your page by adding beautiful banner slides that makes your page unique. you can add up to 4 slides that describe your product offerings, promo, discounts, new stock etc. Make sure the logo and the background banners contrast well for appealing aesthetics";

interface StoreFormProps {
    isEditForm: boolean; //todo change to correct type
}
type StoreFormErrMsgs = {
    storeName?: string;
    currency?: string;
    description?: string;
    storeCategories?: string;
    banners?: string;
};

type FieldValue = {
    storeName?: string;
    selectedCurrency?: Currency;
    description?: string;
    storeCategories?: MultiSelectProps["items"];
    banners?: FileWithPreview[];
    storeAlreadyExist?: boolean;
};

interface Currency {
    id: string | number;
    label: string;
    currencySymbol: string;
}

export const StoreForm: React.FC<StoreFormProps> = ({ isEditForm }) => {
    const [storeName, setStoreName] = React.useState<string>("");
    const [storeNameAlreadyExist, setStoreNameAlreadyExist] =
        React.useState<boolean>(false);
    const [storeCategories, setStoreCategories] =
        React.useState<MultiSelectProps["items"]>();
    const [formErrMsgs, setFormErrMsgs] = React.useState<StoreFormErrMsgs>();
    /** store saved to DB, usually from the create form and then published */
    const [savedStore, setSavedStore] = React.useState<Store>();
    /** store gotten from DB, in the event of an edit */
    const [existingStore, setExistingStore] = React.useState<Store>();
    const [description, setDescription] = React.useState<string>("");
    const [instagramPage, setInstagramPage] = React.useState<string>();
    const [twitterPage, setTwitterPage] = React.useState<string>();
    const [facebookPage, setFacebookPage] = React.useState<string>();
    const [saving, setSaving] = React.useState<boolean>(false);
    const [publishing, setPublishing] = React.useState<boolean>(false);
    const [copyBtnText, setCopyBtnText] = React.useState<"Copy" | "Copied!">(
        "Copy"
    );
    const [shopLogo, setShopLogo] = React.useState<FileWithPreview>();
    const [banners, setBanners] = React.useState<Array<FileWithPreview>>([]);
    const [selectedCurrency, setSelectedCurrency] = React.useState<Currency>({
        id: "USD",
        label: "US Dollar ($)",
        currencySymbol: "$"
    });
    const timeoutId = React.useRef<ReturnType<typeof setTimeout> | undefined>();
    const currencies = React.useRef<MultiSelectProps["items"]>(getCurrencies());
    const [loadingStore, setLoadingStore] = React.useState<boolean>(false);
    const [presetBanners, setPresetBanners] =
        React.useState<Map<number, FileWithPreview>>();
    const router = useRouter();
    const user = useGetUser();
    const { productCategories, createNewProductCategory } =
        useGetProductCategories();

    const { supabase } = useBrowserSupabase();
    const pathname = usePathname();
    const [storePath] = pathname.split("/").slice(-2);

    const shopUrl = `${baseURL}/shop/${generateShopAlias(storeName)}`;
    const slug = storePath.split("-").join(" ");

    React.useEffect(() => {
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            const event = e || window.event;
            return (event.returnValue = "Are you sure you want to leave?");
        };

        window.addEventListener("beforeunload", handleWindowClose);
        return () => {
            window.removeEventListener("beforeunload", handleWindowClose);
        };
    }, []);

    //get existing store and prefill form with info
    React.useEffect(() => {
        (async () => {
            if (isEditForm) {
                try {
                    setLoadingStore(true);
                    const { data, error } = await supabase
                        .from(supabaseTables.stores)
                        .select()
                        .eq("slug", storePath)
                        .returns<Store[]>();

                    if (!error && data?.length) {
                        const store = data[0];

                        const { data: fetchedStoreCategories, error: err } =
                            await supabase
                                .from(supabaseTables.store_product_categories)
                                .select("*,category(*)")
                                .eq("store", store.id)
                                .returns<Store["categories"][][number]>();

                        if (fetchedStoreCategories && !err) {
                            setExistingStore(store);
                            setSelectedCurrency(JSON.parse(store.currency));
                            setInstagramPage(store.instagram);
                            setFacebookPage(store.facebook);
                            setTwitterPage(store.twitter);
                            setStoreName(store.name);
                            setDescription(store.description);
                            setStoreCategories(() =>
                                fetchedStoreCategories.map((cat) => ({
                                    ...cat,
                                    id: cat.category.id,
                                    label: cat.category.label
                                }))
                            );

                            setShopLogo(() =>
                                store.shop_logo
                                    ? ({
                                          preview: store.shop_logo
                                      } as FileWithPreview)
                                    : undefined
                            );
                            const bannerList = JSON.parse(
                                store.banners ?? "[]"
                            ) as string[];
                            setBanners(
                                () =>
                                    bannerList.map((b) => ({
                                        preview: b
                                    })) as FileWithPreview[]
                            );
                            setPresetBanners(
                                () =>
                                    new Map(
                                        bannerList.map((b, i) => [
                                            i,
                                            {
                                                preview: b,
                                                name: `banner-image-${i + 1}`
                                            } as FileWithPreview
                                        ])
                                    )
                            );
                        }
                    }
                } catch (err) {
                } finally {
                    setLoadingStore(false);
                }
            }
        })();
    }, [slug, isEditForm, storePath]);
    /* input handlers */

    const checkIfStoreWithNameExists = React.useCallback(
        debounce(async (name) => {
            if (!name) {
                setStoreNameAlreadyExist(false);
            }

            try {
                const { error, data } = await supabase
                    .from(supabaseTables.stores)
                    .select()
                    .eq("name", name);
                if (!error && data?.length) {
                    setStoreNameAlreadyExist(true);
                    formHasErrors(
                        { storeAlreadyExist: true, storeName: name },
                        "storeName"
                    );
                } else {
                    setStoreNameAlreadyExist(false);
                    formHasErrors(
                        { storeAlreadyExist: false, storeName: name },
                        "storeName"
                    );
                }
            } catch (err) {}
        }, 500),
        []
    );

    const handleStoreNameChange = React.useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            try {
                const newStoreName = e.target.value;
                setStoreName(newStoreName);
                formHasErrors({ storeName: newStoreName }, "storeName");
                await checkIfStoreWithNameExists(newStoreName);
            } catch (err) {}
        },
        []
    );

    const handleCurrencySelection = React.useCallback(
        ([currency]: MultiSelectProps["items"]) => {
            setSelectedCurrency(() => {
                const newCurrency = {
                    ...currency,
                    currencySymbol: extractCurrencyInBracket(currency.label)!
                };
                formHasErrors({ selectedCurrency: newCurrency }, "currency");
                return newCurrency;
            });
        },
        []
    );

    const handleDescriptionChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const desc = e.target.value;
            setDescription(desc);
            formHasErrors({ description: desc }, "description");
        },
        []
    );

    const handleBannerFilesChange = (files: FileWithPreview[]) => {
        setBanners(files);
        formHasErrors({ banners: files }, "banners");
    };

    const editFormCrumbs = [
        {
            name: "Stores",
            link: "/dashboard/stores"
        },
        {
            name: slug,
            link: `dashboard/stores/${storePath}`
        },
        {
            name: "Edit"
        }
    ];

    const createFormCrumbs = [
        {
            name: "Stores",
            link: "/dashboard/stores"
        },
        {
            name: "New Store"
        }
    ];

    React.useEffect(() => {
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, []);

    const handleCopy = React.useCallback(async () => {
        await copyToClipboard(shopUrl);
        setCopyBtnText("Copied!");
        timeoutId.current = setTimeout(() => {
            setCopyBtnText("Copy");
        }, 2000);
    }, [shopUrl, timeoutId]);

    const handleLogoFileInputChange = React.useCallback(
        (file: FileWithPreview[]) => {
            setShopLogo(file[0]);
        },
        []
    );

    //if the form err message object has at least one value
    const formHasErrors = React.useCallback(
        (
            {
                storeName,
                description,
                selectedCurrency,
                storeAlreadyExist,
                storeCategories,
                banners
            }: FieldValue,
            key?: keyof StoreFormErrMsgs
        ): boolean => {
            let errorMsg: StoreFormErrMsgs = {};
            switch (key) {
                case "storeName":
                    errorMsg = {
                        storeName: !storeName?.length
                            ? "Please provide store name"
                            : storeAlreadyExist
                            ? `A store with the name ${storeName} already exists`
                            : undefined
                    };
                    break;
                case "description":
                    errorMsg = {
                        description: !description?.length
                            ? "Please provide description for your store"
                            : undefined
                    };
                    break;
                case "currency":
                    errorMsg = {
                        currency: !selectedCurrency
                            ? "Please select the currency your store products"
                            : undefined
                    };
                    break;
                case "storeCategories":
                    errorMsg = {
                        storeCategories: !storeCategories?.length
                            ? "Please choose the categories for your store products"
                            : undefined
                    };
                    break;
                case "banners":
                    errorMsg = {
                        banners: !banners?.length
                            ? "Please add banners to customize your site further"
                            : undefined
                    };
                    break;
                default:
                    errorMsg = {
                        storeName: !storeName?.length
                            ? "Please provide store name"
                            : undefined,
                        description: !description?.length
                            ? "Please provide description for your store"
                            : undefined,
                        currency: !selectedCurrency
                            ? "Please select the currency your store products"
                            : undefined,
                        storeCategories: !storeCategories?.length
                            ? "Please choose the categories for your store products"
                            : undefined,
                        banners: !banners?.length
                            ? "Please add banners to customize your site further"
                            : undefined
                    };
            }

            setFormErrMsgs((prev) => ({ ...prev, ...errorMsg }));

            return !!Object.values(errorMsg ?? {}).find(
                (formInputErr) => formInputErr !== undefined
            );
        },
        []
    );

    /**
     * create or update store if it exist
     */
    const upsertStore = React.useCallback(
        async (isDraft = true) => {
            const storeSlug = spaceSeparatedStrToPath(storeName?.trim());
            if (!user) {
                toast(<p className="text-sm">User information invalid</p>, {
                    type: "error"
                });
                return;
            }
            if (
                formHasErrors({
                    banners,
                    selectedCurrency,
                    storeAlreadyExist: storeNameAlreadyExist,
                    storeCategories,
                    storeName,
                    description
                })
            )
                return;
            isDraft ? setSaving(true) : setPublishing(true);

            async function updateOrCreateStore(storeSlug: string) {
                const createdStore = await supabase
                    .from(supabaseTables.stores)
                    .upsert(
                        {
                            name: storeName?.trim(),
                            slug: storeSlug,
                            description: description?.trim(),
                            facebook: facebookPage,
                            instagram: instagramPage,
                            twitter: twitterPage,
                            currency: JSON.stringify(selectedCurrency),
                            isPublished: !isDraft,
                            user_id: user?.id,
                            secondary_key:
                                existingStore?.secondary_key ??
                                shortid.generate()
                        },
                        {
                            onConflict: "secondary_key"
                        }
                    )
                    .eq("id", existingStore?.id ?? savedStore?.id)
                    .eq("user_id", user?.id)
                    .select();
                setSavedStore(
                    createdStore?.data
                        ? (createdStore?.data[0] as Store)
                        : undefined
                );
                return createdStore;
            }

            try {
                const { data, error } = await updateOrCreateStore(storeSlug);
                if (error) throw error;
                const newStore = data[0] as Store;
                await supabase
                    .from(supabaseTables.store_product_categories)
                    .upsert(
                        storeCategories?.map((cat) => ({
                            category: cat.id,
                            store: newStore.id,
                            secondary_key: `${cat.id}-${newStore.id}` //:)
                        })),
                        {
                            onConflict: "secondary_key"
                        }
                    )
                    .select();
                let shop_logo,
                    bannerUrls: (string | undefined)[] = [];

                if (shopLogo) {
                    //upload to bucket
                    const logoFileName = `${user.id}/${newStore.id}/logo/${storeSlug}`;
                    const { data: logoData, error: logoErr } =
                        await supabase.storage
                            .from(supabaseBuckets.shop)
                            .upload(logoFileName, shopLogo, {
                                cacheControl: "3600",
                                upsert: true,
                                contentType: shopLogo.type
                            });

                    if (logoData && !logoErr) {
                        //get public url from bucket
                        const logoPublicStore = await supabase.storage
                            .from(supabaseBuckets.shop)
                            .getPublicUrl(logoFileName);

                        shop_logo = logoPublicStore.data.publicUrl;
                    }
                }

                if (banners?.length) {
                    bannerUrls = await Promise.all(
                        banners.map(async (banner, i) => {
                            const storeFileName = `${user.id}/${newStore.id}/banners/${storeSlug}-${i}`;
                            const { data, error } = await supabase.storage
                                .from(supabaseBuckets.shop)
                                .upload(storeFileName, banner, {
                                    cacheControl: "3600",
                                    upsert: true,
                                    contentType: banner.type
                                });

                            if (data && !error) {
                                //get public url from bucket
                                const bannerPublicStore = await supabase.storage
                                    .from(supabaseBuckets.shop)
                                    .getPublicUrl(storeFileName);
                                return bannerPublicStore.data.publicUrl;
                            }
                        })
                    );
                }

                const { data: finalUpdateForStore, error: finalErr } =
                    await supabase
                        .from(supabaseTables.stores)
                        .update({
                            banners: JSON.stringify(
                                bannerUrls.filter((b) => !!b)
                            ),
                            shop_logo
                        })
                        .eq("id", newStore.id)
                        .select()
                        .returns<Store[]>();

                if (finalUpdateForStore && !finalErr) {
                    setSavedStore(finalUpdateForStore[0]);
                }

                toast(<p className="text-sm">Successfully registered</p>, {
                    type: "success"
                });
                router.push("/dashboard/stores");
            } catch (err) {
                toast(<p className="text-sm">Failed to create store</p>, {
                    type: "error"
                });
            } finally {
                setSaving(false);
                setPublishing(false);
            }
        },
        [
            savedStore,
            existingStore,
            banners,
            selectedCurrency,
            storeNameAlreadyExist,
            storeCategories,
            description,
            storeName,
            shopLogo,
            user
        ]
    );

    const handleStoreCategoryChange = React.useCallback(
        (categories: MultiSelectProps["items"]) => {
            setStoreCategories(categories);
            formHasErrors({ storeCategories: categories }, "storeCategories");
        },
        []
    );

    return (
        <div className="p-6 flex flex-col w-full dashboard-screen-height overflow-auto">
            <SavingPrompt isOpen={publishing || saving} />
            <div className="flex flex-col pb-6 border-b border-slate-200 w-full">
                <Breadcrumb
                    crumbs={isEditForm ? editFormCrumbs : createFormCrumbs}
                />
                <div className="flex flex-col md:flex-row items-center justify-between mt-6">
                    <div className="flex items-center self-start">
                        <h3 className="text-lg font-base mr-3">New Store</h3>
                        <span className="inline-block bg-slate-200 text-xs flex text-slate-700 items-center justify-center rounded-full w-10 h-5">
                            Draft
                        </span>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0">
                        <Button
                            loading={saving}
                            loadingText="Saving"
                            disabled={publishing || saving}
                            onClick={async () => await upsertStore(true)}
                            leftIcon={
                                <PencilIcon className="h-4 w-4 mr-2 text-gray-700" />
                            }
                            text="Save draft"
                            className="w-32 h-10 rounded-full bg-white hover:bg-slate-100 transition mr-4 border border-slate-200 shadow-md flex justify-center items-center"
                        />
                        <Button
                            loading={publishing}
                            loadingText="Publishing"
                            disabled={publishing || saving}
                            text="Publish"
                            onClick={async () => await upsertStore(false)}
                            leftIcon={
                                <CheckIcon className="h-5 w-5 text-white mr-2" />
                            }
                            textClassNames="text-white"
                            className="text-white w-32 h-10 rounded-full primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center"
                        />
                    </div>
                </div>
            </div>
            {loadingStore ? (
                <div className="flex items-center justify-center my-4">
                    <Spinner size="large" />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row w-full mt-6">
                    <div className="flex-1 order-last md:px-6 md:order-first h-full overflow-auto">
                        <div className="flex flex-col mb-6">
                            <div className="flex mb-1">
                                <p className="mr-1">Currency</p>
                                <span className="text-[#6d67e4]">*</span>
                            </div>
                            <p className="text-xs font-light mb-0.5">
                                What currencies would you like your products to
                                be displayed in?
                            </p>
                            <MultiSelectInput
                                items={currencies.current}
                                onSelect={handleCurrencySelection}
                                multiple={false}
                                initialItems={[selectedCurrency]}
                            />
                            {formErrMsgs?.currency && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrMsgs?.currency}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col mb-6">
                            <div className="flex mb-1">
                                <p className="mr-1">Name</p>
                                <span className="text-[#6d67e4]">*</span>
                            </div>
                            <p className="text-xs font-light mb-1">
                                30 characters max
                            </p>
                            <input
                                type="text"
                                id="table-search"
                                value={storeName}
                                onChange={handleStoreNameChange}
                                placeholder="What would you call your new store?"
                                className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                            />
                            {formErrMsgs?.storeName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrMsgs?.storeName}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col mb-6">
                            <p className="mr-1 mb-1">Shop website link</p>
                            <p className="text-xs font-light mb-1">
                                As soon as you publish your store this website
                                link would be public and can be accessed by your
                                customers immediately.
                            </p>
                            <div className="relative">
                                <div
                                    onClick={handleCopy}
                                    className="absolute right-0 top-0 w-20 h-full border cursor-pointer border-gray-30 rounded-r-md flex items-center justify-center bg-slate-100"
                                >
                                    <p className="text-sm">{copyBtnText}</p>
                                </div>
                                <input
                                    type="text"
                                    disabled
                                    value={shopUrl}
                                    className="block p-2 pl-10 text-sm text-black bg-slate-50 border border-gray-300 w-full rounded-md overflow-hidden text-ellipsis"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mb-6">
                            <div className="flex mb-1">
                                <p className="mr-1">Description</p>
                                <span className="text-[#6d67e4]">*</span>
                            </div>
                            <textarea
                                id="table-search"
                                onChange={handleDescriptionChange}
                                value={description}
                                placeholder="The clearer and shorter the better"
                                className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                            />
                            {formErrMsgs?.description && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrMsgs?.description}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col mb-6">
                            <p className="mr-1 mb-1">Shop logo</p>
                            <p className="text-xs font-light mb-2">
                                You can add a logo to stand out from the crowd
                                and personalize your shop page to look very
                                professional
                            </p>
                            <FileWidget
                                handleFiles={handleLogoFileInputChange}
                                maxFiles={1}
                            >
                                <div className="border border-slate-200 border-dashed rounded-md p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex items-center justify-center bg-slate-50 mr-4">
                                                {shopLogo ? (
                                                    <Image
                                                        src={shopLogo.preview}
                                                        alt="shop logo"
                                                        width={48}
                                                        height={48}
                                                    />
                                                ) : (
                                                    <PhotoIcon className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-600">
                                                    Upload a logo that makes
                                                    your brand stand out
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    SVG, PNG, JPG, or GIF (rec.
                                                    700 * 430px)
                                                </p>
                                            </div>
                                        </div>
                                        <button className="bg-white border border-slate-100 rounded-full p-1 w-24 shadow-md text-slate-600">
                                            {shopLogo ? "Change" : "Browse"}
                                        </button>
                                    </div>
                                </div>
                            </FileWidget>
                        </div>
                        <div className="mb-6">
                            <div className="flex mb-1">
                                <p className="mr-1">Categories</p>
                                <span className="text-[#6d67e4]">*</span>
                            </div>
                            <p className="text-xs font-light mb-2">
                                Basically, the products you sell, what category
                                can you group them in for this store, you can
                                select multiple categories as applicable. Note
                                this might to certain degree influence your
                                visibility ranking in the future.
                            </p>
                            <MultiSelectInput
                                items={productCategories}
                                onSelect={handleStoreCategoryChange}
                                createNewItem={createNewProductCategory}
                                initialItems={storeCategories}
                            />
                            {formErrMsgs?.storeCategories && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrMsgs?.storeCategories}
                                </p>
                            )}
                        </div>
                        <div className="mb-6">
                            <div className="flex flex-col mb-1">
                                <p className="mr-1">Instagram page</p>
                                <p className="text-xs font-light mb-1">
                                    Please provide the instagram page for this
                                    store if available
                                </p>
                            </div>
                            <input
                                type="text"
                                value={instagramPage}
                                onChange={(e) =>
                                    setInstagramPage(e.target.value)
                                }
                                className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md overflow-hidden text-ellipsis"
                            />
                        </div>
                        <div className="mb-6">
                            <div className="flex flex-col mb-1">
                                <p className="mr-1">Facebook page</p>
                                <p className="text-xs font-light mb-1">
                                    Please provide the facebook page for this
                                    store if available
                                </p>
                            </div>
                            <input
                                type="text"
                                value={facebookPage}
                                onChange={(e) =>
                                    setFacebookPage(e.target.value)
                                }
                                className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md overflow-hidden text-ellipsis"
                            />
                        </div>
                        <div className="mb-6">
                            <div className="flex flex-col mb-1">
                                <p className="mr-1">Twitter page</p>
                                <p className="text-xs font-light mb-1">
                                    Please provide the twitter page for this
                                    store if available
                                </p>
                            </div>
                            <input
                                type="text"
                                value={twitterPage}
                                onChange={(e) => setTwitterPage(e.target.value)}
                                className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md overflow-hidden text-ellipsis"
                            />
                        </div>
                    </div>
                    <div className="flex-none md:flex-1 px-0 md:px-6 order-first mb-6 md:mb-0 md:order-last overflow-y-auto border-0 md:border-l md:border-slate-100">
                        {formErrMsgs?.banners && (
                            <p className="text-red-500 text-xs my-1">
                                {formErrMsgs?.banners}
                            </p>
                        )}
                        <ImagePicker
                            description={imagePickerBannerDesc}
                            title="Shop banner slides"
                            maxFiles={4}
                            dimensionInfo="rec. 1200 * 1000px"
                            handleFileChange={handleBannerFilesChange}
                            logo={shopLogo}
                            presetBanners={presetBanners}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
