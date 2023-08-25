"use client";
import React from "react";
import { Breadcrumb } from "@components/Breadcrumb";
import { Switch, Transition } from "@headlessui/react";
import { CheckIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

import {
    convertPathToSpaceSeparatedStr,
    spaceSeparatedStrToPath
} from "@lib/format-utils";
import { ImagePicker } from "./ImagePicker";
import { ProductVariantForm } from "./ProductVariantForm";
import MultiSelectInput, {
    MultiSelectProps
} from "@components/Input/MultiSelectInput";
import { Product } from "../typing";
import shortid from "shortid";
import { FileWithPreview } from "@components/FileWidget";
import { debounce, excludeKeysFromObj } from "@lib/common.utils";
import { supabaseBuckets, supabaseTables } from "@lib/constants";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { useGetUser } from "@hooks/useGetUser";
import { useGetStoreBySlug } from "../hooks/useGetStoreBySlug";
import { Spinner } from "@components/Spinner";
import { Button } from "@components/Button";
import { SavingPrompt } from "./modals/SavingPrompt";

interface ProductFormProps {
    isEditForm: boolean;
}

const warrantyPeriods = [
    { label: "Less than a year", id: "<1" },
    { label: "1 year", id: "1" },
    { label: "2 years", id: "2" },
    { label: "3 years", id: "3" },
    { label: "4 years", id: "4" },
    { label: "5 years", id: "5" },
    { label: "Greater than 5 years", id: ">5" }
];

type VariantType = Map<string, { name: string; values?: Map<string, string> }>;
type FormErrorMessagesType = Omit<
    Product,
    "sku_code" | "store" | "variations" | "product_images"
> & {
    productNameExists: boolean;
    variations: VariantType;
    product_images: FileWithPreview[];
};
type FormErrors = {
    [key in keyof FormErrorMessagesType]: string | undefined;
};

export const ProductForm: React.FC<ProductFormProps> = ({ isEditForm }) => {
    //state
    const [variantOptions, setVariantOptions] = React.useState<VariantType>(
        new Map()
    );
    const [formState, setFormState] =
        React.useState<
            Partial<Omit<Product, "store"> & { productNameExists: boolean }>
        >();
    const [banners, setBanners] = React.useState<Array<FileWithPreview>>([]);
    const [formErrMessages, setFormErrMessages] =
        React.useState<Partial<FormErrors>>();
    const [saving, setSaving] = React.useState<boolean>(false);
    const [publishing, setPublishing] = React.useState<boolean>(false);
    const [loadingProduct, setLoadingProduct] = React.useState<boolean>(false);

    //hooks
    const { supabase } = useBrowserSupabase();
    const pathname = usePathname();
    const user = useGetUser();
    const router = useRouter();
    const [, , , storePath, , productPath] = pathname.split("/");
    const { loading, store } = useGetStoreBySlug(storePath);

    const transformBannerToMap = React.useCallback(
        (banners: any[]) =>
            new Map(
                banners.map((b, i) => [
                    i,
                    {
                        preview: b,
                        name: `product-banner-image-${i + 1}`
                    } as FileWithPreview
                ])
            ),
        []
    );

    const editFormCrumbs = [
        {
            name: "Stores",
            link: "/dashboard/stores"
        },
        {
            name: storePath.split("-").join(" "),
            link: `/dashboard/stores/${storePath}`
        },
        {
            name: productPath.split("-").join(" ")
        }
    ];

    const createFormCrumbs = [
        {
            name: "Stores",
            link: "/dashboard/stores"
        },
        {
            name: storePath.split("-").join(" "),
            link: `/dashboard/stores/${storePath}`
        },
        {
            name: "New Product"
        }
    ];

    const formHasErrors = (
        payload: Partial<FormErrorMessagesType>
    ): boolean => {
        let errorMsg: Partial<FormErrors> = {};

        if ("productNameExists" in payload) {
            errorMsg.productNameExists = payload.productNameExists
                ? "Product with this name already exist for this store"
                : undefined;
        }

        if ("name" in payload) {
            errorMsg.name = !payload.name?.length
                ? "Please provide name of your product"
                : undefined;
        }

        if ("description" in payload) {
            errorMsg.description = !payload.description?.length
                ? "Please provide description for your store"
                : undefined;
        }

        if ("inventory_count" in payload) {
            errorMsg.inventory_count =
                !payload.inventory_count || payload.inventory_count <= 0
                    ? "Please add the quantity of this product"
                    : undefined;
        }

        if ("pricing" in payload) {
            errorMsg.pricing =
                !payload.pricing || payload.pricing <= 0
                    ? "Please specify the price of this product"
                    : undefined;
        }

        if ("product_images" in payload) {
            errorMsg.product_images = !payload.product_images?.length
                ? "Please add product images"
                : undefined;
        }

        if ("categories" in payload) {
            const parsedValue = payload.categories?.length
                ? JSON.parse(payload.categories)
                : [];
            errorMsg.categories = !parsedValue.length
                ? "Please select the categories your product belongs too"
                : undefined;
        }

        if ("variations" in payload) {
            let inconsistentPairing = false; //option name exist with option values
            Array.from(payload.variations?.values() ?? []).forEach((v) => {
                if (
                    v.name.length &&
                    !!Array.from(v?.values?.values() ?? []).filter(
                        (v) => !v.length
                    )?.length
                ) {
                    inconsistentPairing = true;
                }
            });
            errorMsg.variations = inconsistentPairing
                ? "Please provide values for every variant option name"
                : undefined;
        }

        setFormErrMessages((prev) => ({ ...(prev ?? {}), ...errorMsg }));

        //check  if there is any error
        return !!Object.values(errorMsg ?? {}).find(
            (formInputErr) => formInputErr !== undefined
        );
    };

    //get existing store
    React.useEffect(() => {
        (async () => {
            if (isEditForm && store && user) {
                try {
                    setLoadingProduct(true);
                    const { data, error } = await supabase
                        .from(supabaseTables.products)
                        .select()
                        .eq("user", user.id)
                        .eq("store", store.id)
                        .eq("slug", productPath)
                        .returns<Product[]>();

                    if (data?.length && !error) {
                        const productFromDB = data[0];
                        setBanners(() =>
                            JSON.parse(productFromDB.product_images ?? "[]")
                        );
                        setVariantOptions(() => {
                            const data = JSON.parse(
                                productFromDB.variations ?? []
                            );
                            return new Map(
                                data.map((d: any) => {
                                    const [key, val] = d;
                                    return [
                                        key,
                                        {
                                            name: val.name,
                                            values: new Map(
                                                JSON.parse(val.values)
                                            )
                                        }
                                    ];
                                })
                            );
                        });
                        setFormState((prev) => ({ ...prev, ...productFromDB }));
                    }
                } catch (err) {
                } finally {
                    setLoadingProduct(false);
                }
            }
        })();
    }, [isEditForm, storePath, store, user, productPath]);

    const upsertProduct = React.useCallback(
        async (isDraft = true) => {
            if (!user || !store) {
                toast(<p className="text-sm">User information invalid</p>, {
                    type: "error"
                });
                return;
            }
            if (!formState) {
                toast(<p className="text-sm">Failed to create product</p>, {
                    type: "error"
                });
                return;
            }

            if (
                formHasErrors({
                    ...excludeKeysFromObj(formState, [
                        "sku_code",
                        "variations",
                        "product_images"
                    ]),
                    product_images: banners,
                    variations: variantOptions
                })
            )
                return;

            const productSlug = spaceSeparatedStrToPath(
                formState.name?.trim() ?? ""
            );
            isDraft ? setSaving(true) : setPublishing(true);
            //variation options.
            const variationsCopy = new Map(variantOptions);
            Array.from(variationsCopy.entries()).forEach(([key, option]) => {
                variationsCopy.set(key, {
                    name: variationsCopy.get(key)?.name ?? "",
                    values: JSON.stringify(
                        Array.from(
                            variationsCopy.get(key)?.values?.entries() ?? []
                        )
                    ) as any
                });
                option.values;
            });
            try {
                const { data, error } = await supabase
                    .from(supabaseTables.products)
                    .upsert(
                        {
                            ...excludeKeysFromObj(formState, [
                                "productNameExists"
                            ]),
                            variations: JSON.stringify(
                                Array.from(variationsCopy.entries())
                            ),
                            user: user.id,
                            store: store.id,
                            slug: productSlug,
                            isPublished: !isDraft,
                            store_slug: store.slug,
                            secondary_key:
                                formState.secondary_key ?? shortid.generate()
                        },
                        { onConflict: "secondary_key" }
                    )
                    .select()
                    .returns<Product[]>();

                if (data?.length && !error) {
                    const newProduct = data[0];
                    let bannerURLs: (string | undefined)[] = [];
                    if (banners.length) {
                        //upload to bucket
                        bannerURLs = await Promise.all(
                            banners.map(async (banner, i) => {
                                const productFileName = `${user.id}/${store.id}/${newProduct.id}/${productSlug}-${i}`;
                                const { data: d, error: e } =
                                    await supabase.storage
                                        .from(supabaseBuckets.shop)
                                        .upload(productFileName, banner, {
                                            cacheControl: "3600",
                                            upsert: true,
                                            contentType: banner.type
                                        });
                                if (d && !e) {
                                    const bannerPublicStore =
                                        await supabase.storage
                                            .from(supabaseBuckets.shop)
                                            .getPublicUrl(productFileName);
                                    return bannerPublicStore.data.publicUrl;
                                }
                            })
                        );
                    }

                    const { data: finalUpdateForStore, error: finalErr } =
                        await supabase
                            .from(supabaseTables.products)
                            .update({
                                product_images: JSON.stringify(
                                    bannerURLs.filter((b) => !!b)
                                )
                            })
                            .eq("id", newProduct.id)
                            .select()
                            .returns<Product[]>();

                    if (finalUpdateForStore && !finalErr) {
                        setFormState((prev) => ({
                            ...prev,
                            ...finalUpdateForStore[0]
                        }));
                    }

                    router.push(`/dashboard/stores/${store.slug}`);
                    toast(<p className="text-sm">Successfully registered</p>, {
                        type: "success"
                    });
                }
            } catch (err) {
            } finally {
                setSaving(false);
                setPublishing(false);
            }
        },
        [user, formState, banners, formErrMessages, variantOptions, store]
    );

    const handleFormChange = React.useCallback(
        (
            formKey: keyof Partial<
                Omit<Product, "store"> & { productNameExists: boolean }
            >,
            formValue: any
        ) => {
            setFormState((prevState) => ({
                ...(prevState ?? {}),
                [formKey]: formValue
            }));
        },
        []
    );

    const handleVariantNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, variantKey: string) => {
            setVariantOptions((prev) => {
                prev.set(variantKey, {
                    name: e.target.value,
                    values: prev.get(variantKey)?.values
                });
                const newVariantOptions = new Map([...prev]);
                formHasErrors({ variations: newVariantOptions });
                return newVariantOptions;
            });
        },
        []
    );

    const handleEditVariantOption = React.useCallback(
        (
            e: React.ChangeEvent<HTMLInputElement>,
            variantKey: string,
            valueKey: string
        ) => {
            const variantValue = e.target.value;
            setVariantOptions((prev) => {
                prev.get(variantKey)?.values?.set(valueKey, variantValue);
                const newVariantOptions = new Map([...prev]);
                formHasErrors({ variations: newVariantOptions });
                return newVariantOptions;
            });
        },
        []
    );

    const removeVariantValue = React.useCallback(
        (variantKey: string, valueKey: string) => {
            setVariantOptions((prev) => {
                prev.get(variantKey)?.values?.delete(valueKey);
                const newVariantOptions = new Map([...prev]);
                formHasErrors({ variations: newVariantOptions });
                return newVariantOptions;
            });
        },
        []
    );

    const handleAddValue = React.useCallback((variantKey: string) => {
        const newVariantValKey = shortid.generate();
        setVariantOptions((prev) => {
            prev.get(variantKey)?.values?.set(newVariantValKey, "");
            const newVariantOptions = new Map([...prev]);
            formHasErrors({ variations: newVariantOptions });
            return newVariantOptions;
        });
    }, []);

    const handleAddVariant = React.useCallback(() => {
        const newVariantKey = shortid.generate();
        setVariantOptions((prev) => {
            prev.set(newVariantKey, { name: "", values: new Map() });
            return new Map([...prev]);
        });
    }, []);

    const removeValue = React.useCallback((variantKey: string) => {
        setVariantOptions((prev) => {
            prev.delete(variantKey);
            const newVariantOptions = new Map([...prev]);
            formHasErrors({ variations: newVariantOptions });
            return newVariantOptions;
        });
    }, []);

    const handleNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newName = e.target.value;
            handleFormChange("name", newName);
            formHasErrors({ name: newName });
            checkIfProductWithNameExists(newName);
        },
        [store]
    );

    const checkIfProductWithNameExists = React.useCallback(
        debounce(async (name) => {
            try {
                if (!store) return;
                //same product name for the store
                const { error, data } = await supabase
                    .from(supabaseTables.products)
                    .select()
                    .eq("name", name)
                    .eq("store", store.id);

                if (!error && data?.length) {
                    handleFormChange("productNameExists", true);
                    formHasErrors({ productNameExists: true });
                } else {
                    handleFormChange("productNameExists", false);
                    formHasErrors({ productNameExists: false });
                }
            } catch (err) {}
        }, 500),
        [store]
    );

    const handleStoreCategoryChange = React.useCallback(
        (categories: MultiSelectProps["items"]) => {
            const newCategories = JSON.stringify(categories);
            handleFormChange("categories", newCategories);
            formHasErrors({ categories: newCategories });
        },
        []
    );

    const handleDescriptionChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newDescription = e.target.value;
            handleFormChange("description", newDescription);
            formHasErrors({ description: newDescription });
        },
        []
    );

    const handleInventoryCountChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newInventoryCount = Number(e.target.value);
            handleFormChange("inventory_count", newInventoryCount);
            formHasErrors({ inventory_count: newInventoryCount });
        },
        []
    );

    const handleSKUChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFormChange("sku_code", e.target.value);
        },
        []
    );

    const generateSKUCode = React.useCallback(() => {
        handleFormChange("sku_code", shortid.generate()); //add store name as prefix
    }, []);

    const handlePricingChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newPricing = parseFloat(e.target.value);
            handleFormChange("pricing", newPricing);
            formHasErrors({ pricing: newPricing });
        },
        []
    );

    const handleDiscountChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFormChange("discount", parseFloat(e.target.value));
        },
        []
    );

    const handleFilesBannerChange = React.useCallback(
        (files: FileWithPreview[]) => {
            setBanners(files);
            formHasErrors({ product_images: files });
        },
        []
    );

    const handleWarrantyPeriodChange = React.useCallback(
        (period: MultiSelectProps["items"]) => {
            handleFormChange("warranty_period", period[0].id);
        },
        []
    );

    const inStoreOnly = formState?.selling_type === "in-store";
    const onlineStoreOnly = formState?.selling_type === "online";
    const bothOnlineAndInStore = formState?.selling_type === "both";

    const handleSetInStoreOnly = React.useCallback((checked: boolean) => {
        handleFormChange("selling_type", checked ? "in-store" : undefined);
    }, []);

    const handleSetOnlineSellingType = React.useCallback((checked: boolean) => {
        handleFormChange("selling_type", checked ? "online" : undefined);
    }, []);

    const handleBothSellingTypeChange = React.useCallback(
        (checked: boolean) => {
            const sellingType = checked ? "both" : undefined;
            handleFormChange("selling_type", sellingType);
            setFormErrMessages((prev) => ({
                ...prev,
                delivery_charge:
                    sellingType === "both" &&
                    (formState?.delivery_charge ?? 0) <= 0
                        ? "Please provide delivery charge for online purchases"
                        : undefined,
                pickup_store_address:
                    sellingType === "both" &&
                    !formState?.pickup_store_address?.length
                        ? "Please provide delivery charge for online purchases"
                        : undefined
            }));
        },
        [formState]
    );

    const handleDeliveryCharge = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const charge = parseFloat(e.target.value);
            handleFormChange("delivery_charge", charge);
            const shouldError =
                formState?.selling_type === "online" && charge <= 0;
            setFormErrMessages((prev) => ({
                ...prev,
                delivery_charge: shouldError
                    ? "Please provide delivery charge for online purchases"
                    : undefined
            }));
        },
        [formState]
    );

    const handleDeliveryLocationRestriction = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFormChange("delivery_location_restriction", e.target.value);
        },
        []
    );

    const handlePickUpStoreAddress = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const pickupAddress = e.target.value;
            handleFormChange("pickup_store_address", pickupAddress);
            const shouldError =
                formState?.selling_type === "in-store" && !pickupAddress.length;
            setFormErrMessages((prev) => ({
                ...prev,
                pickup_store_address: shouldError
                    ? "Please provide pickup address for in-store purchases"
                    : undefined
            }));
        },
        [formState]
    );

    const handleHasWarrantyChange = React.useCallback((checked: boolean) => {
        handleFormChange("has_warranty", checked);
    }, []);

    return (
        <section className="p-6 flex flex-col w-full h-full dashboard-screen-height overflow-auto">
            <SavingPrompt isOpen={publishing || saving} />
            <div className="flex flex-col pb-6 border-b border-slate-200 w-full">
                <Breadcrumb
                    crumbs={isEditForm ? editFormCrumbs : createFormCrumbs}
                />
                <div className="flex flex-col md:flex-row items-center justify-between mt-6">
                    <div className="flex items-center self-start">
                        <h3 className="text-lg font-base mr-3 capitalize">
                            {isEditForm
                                ? convertPathToSpaceSeparatedStr(productPath)
                                      .fmt
                                : "New Product"}
                        </h3>
                        <span className="inline-block bg-slate-200 text-xs flex text-slate-700 items-center justify-center rounded-full w-10 h-5">
                            Draft
                        </span>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0">
                        <Button
                            loading={saving}
                            loadingText="Saving"
                            disabled={publishing || saving}
                            onClick={async () => await upsertProduct(true)}
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
                            onClick={async () => await upsertProduct(false)}
                            leftIcon={
                                <CheckIcon className="h-5 w-5 text-white mr-2" />
                            }
                            textClassNames="text-white"
                            className="text-white w-32 h-10 rounded-full primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center"
                        />
                    </div>
                </div>
            </div>
            {loading || loadingProduct ? (
                <div className="flex items-center justify-center my-4">
                    <Spinner size="large" />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row w-full mt-6">
                    <div className="flex-1 order-last md:px-6 md:order-first h-full overflow-auto">
                        <div className="flex flex-col w-full mb-6">
                            <p className="mb-2">Description</p>
                            <div className="w-full p-5 flex flex-col border border-slate-100 rounded-md shadow-md">
                                <div className="flex flex-col mb-6">
                                    <div className="flex mb-1">
                                        <p className="mr-1">Name</p>
                                        <span className="text-[#6d67e4]">
                                            *
                                        </span>
                                    </div>
                                    <p className="text-xs font-light mb-1">
                                        20 characters max
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="What would you call this product"
                                        onChange={handleNameChange}
                                        value={formState?.name ?? ""}
                                        className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                    />
                                    {formErrMessages?.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrMessages?.name}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex mb-1">
                                        <p className="mr-1">Description</p>
                                        <span className="text-[#6d67e4]">
                                            *
                                        </span>
                                    </div>
                                    <textarea
                                        id="table-search"
                                        placeholder="The clearer and shorter the better"
                                        onChange={handleDescriptionChange}
                                        value={formState?.description ?? ""}
                                        className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                    />
                                    {formErrMessages?.description && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrMessages?.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full mb-6">
                            <p className="mb-2">Inventory</p>
                            <div className="w-full p-5 flex items-center border border-slate-100 rounded-md shadow-md">
                                <div className="mr-8">
                                    <div className="flex">
                                        <p className="text-xs mb-2 text-gray-600 mr-1">
                                            Quantity
                                        </p>
                                        <span className="text-[#6d67e4]">
                                            *
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="250"
                                        onChange={handleInventoryCountChange}
                                        value={formState?.inventory_count ?? ""}
                                        className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                    />
                                    {formErrMessages?.inventory_count && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrMessages?.inventory_count}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs mb-2 text-gray-600">
                                        SKU (Optional)
                                    </p>
                                    <div className="relative">
                                        <div
                                            onClick={generateSKUCode}
                                            className="absolute right-0 top-0 w-20 h-full border cursor-pointer border-gray-30 rounded-r-md flex items-center justify-center bg-slate-100"
                                        >
                                            <p className="text-sm">Generate</p>
                                        </div>
                                        <input
                                            placeholder="AQR-UT-PUT-09"
                                            onChange={handleSKUChange}
                                            value={formState?.sku_code ?? ""}
                                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full mb-6">
                            <p className="mb-2">Selling Type</p>
                            <div className="w-full p-5 flex flex-col border border-slate-100 rounded-md shadow-md">
                                <div className="flex items-center text-sm mb-4">
                                    <Switch
                                        onChange={handleSetOnlineSellingType}
                                        className={`${
                                            onlineStoreOnly
                                                ? "bg-[#6d67e4]"
                                                : "bg-gray-200"
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span className="sr-only">
                                            Selling online only
                                        </span>
                                        <span
                                            className={`${
                                                onlineStoreOnly
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                    <p className="ml-4">Online selling only</p>
                                </div>
                                <div className="flex items-center text-sm mb-4">
                                    <Switch
                                        onChange={handleSetInStoreOnly}
                                        className={`${
                                            inStoreOnly
                                                ? "bg-[#6d67e4]"
                                                : "bg-gray-200"
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span className="sr-only">
                                            In-store selling only
                                        </span>
                                        <span
                                            className={`${
                                                inStoreOnly
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                    <p className="ml-4">
                                        In-store selling only
                                    </p>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Switch
                                        onChange={handleBothSellingTypeChange}
                                        className={`${
                                            bothOnlineAndInStore
                                                ? "bg-[#6d67e4]"
                                                : "bg-gray-200"
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span className="sr-only">
                                            Selling online only
                                        </span>
                                        <span
                                            className={`${
                                                bothOnlineAndInStore
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                    <p className="ml-4">
                                        Available both in-store and online
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full mb-6">
                            <p className="mb-2">Category</p>
                            <div className="w-full p-5 flex flex-col border border-slate-100 rounded-md shadow-md">
                                <div className="mb-6">
                                    <div className="flex mb-1">
                                        <p className="mr-1 text-xs text-gray-600">
                                            Product Category
                                        </p>
                                        <span className="text-[#6d67e4]">
                                            *
                                        </span>
                                    </div>
                                    <p className="text-xs font-light">
                                        These are categories preset when you
                                        created this store, to see more
                                        categories change it from the store edit
                                        page
                                    </p>
                                    <MultiSelectInput
                                        items={store?.categories ?? []}
                                        onSelect={handleStoreCategoryChange}
                                        initialItems={JSON.parse(
                                            formState?.categories ?? "[]"
                                        )}
                                    />
                                    {formErrMessages?.categories && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrMessages?.categories}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center mb-6">
                                    <div className="flex flex-col">
                                        <p className="mr-1 text-xs text-gray-600 mb-1">
                                            Product variants
                                        </p>
                                        <p className="text-xs font-light">
                                            What other possible type of this
                                            product do you have? e.g color,
                                            size, gender etc
                                        </p>
                                    </div>
                                    <div
                                        className="flex items-center text-xs mt-2 md:mt-0 cursor-pointer"
                                        onClick={handleAddVariant}
                                    >
                                        <PlusIcon className="h-4 w-4 text-[#6d67e4] mr-1" />
                                        <p className="text-[#6d67e4]">
                                            Add Variant
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {(variantOptions.size &&
                                        Array.from(
                                            variantOptions.entries()
                                        ).map(([variantKey, option]) => (
                                            <ProductVariantForm
                                                key={variantKey}
                                                removeVariant={removeValue}
                                                handleEditVariantOption={
                                                    handleEditVariantOption
                                                }
                                                handleVariantNameChange={
                                                    handleVariantNameChange
                                                }
                                                removeVariantValue={
                                                    removeVariantValue
                                                }
                                                handleAddValue={() =>
                                                    handleAddValue(variantKey)
                                                }
                                                variantName={option.name}
                                                variantKey={variantKey}
                                                values={option.values}
                                            />
                                        ))) ||
                                        null}
                                </div>
                                {formErrMessages?.variations && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {formErrMessages?.variations}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col w-full mb-6">
                            <p className="mb-2">Pricing</p>
                            <div className="w-full p-5 flex items-center border border-slate-100 rounded-md shadow-md">
                                <div className="flex-1 mr-8">
                                    <div className="flex">
                                        <p className="text-xs mb-2 text-gray-600 mr-1">
                                            Price
                                        </p>
                                        <span className="text-[#6d67e4]">
                                            *
                                        </span>
                                    </div>
                                    <div className="w-full relative">
                                        <span className="inline-block rounded-l-md absolute flex items-center text-gray-700 justify-center left-0.5 top-0.5 bottom-0.5 w-max px-3 bg-gray-100">
                                            $
                                        </span>
                                        <input
                                            value={formState?.pricing ?? ""}
                                            onChange={handlePricingChange}
                                            type="number"
                                            placeholder="200"
                                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                        />
                                    </div>
                                    {formErrMessages?.pricing && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrMessages?.pricing}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-1 relative">
                                    <p className="text-xs mb-2 text-gray-600">
                                        Discount (Optional)
                                    </p>
                                    <div className="w-full relative">
                                        <span className="inline-block rounded-r-md absolute text-gray-700 flex items-center justify-center right-0.5 top-0.5 bottom-0.5 w-max px-3 bg-gray-100">
                                            %
                                        </span>
                                        <input
                                            value={formState?.discount ?? ""}
                                            onChange={handleDiscountChange}
                                            placeholder="10"
                                            type="number"
                                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-none md:flex-1 px-0 md:px-6 order-first mb-6 md:mb-0 md:order-last overflow-y-auto">
                        <div className="flex flex-col w-full mb-6">
                            <p className="mb-2">Delivery</p>
                            <div className="w-full p-5 flex flex-col border border-slate-100 rounded-md shadow-md">
                                <div className="flex items-center text-sm mb-4">
                                    <Switch
                                        onChange={handleSetOnlineSellingType}
                                        className={`${
                                            onlineStoreOnly ||
                                            bothOnlineAndInStore
                                                ? "bg-[#6d67e4]"
                                                : "bg-gray-200"
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span className="sr-only">
                                            Delivery Available
                                        </span>
                                        <span
                                            className={`${
                                                onlineStoreOnly ||
                                                bothOnlineAndInStore
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                    <p className="ml-4">Delivery available</p>
                                </div>
                                <Transition
                                    leave="transition ease-in duration-100"
                                    leaveFrom="translate-y-[-100%]"
                                    leaveTo="translate-y-[0%]"
                                    show={
                                        onlineStoreOnly || bothOnlineAndInStore
                                    }
                                >
                                    <div className="flex items-end mb-4">
                                        <div className="flex-1 mr-8">
                                            <p className="text-xs mb-1 text-gray-600">
                                                Additional Charge (Optional)
                                            </p>
                                            <p className="text-xs font-light mb-2">
                                                Delivery charges will likely
                                                vary per customer's location.
                                                The price here should be the
                                                base price for the possible
                                                closest location your customer
                                                can be.
                                            </p>
                                            <div className="w-full relative">
                                                <span className="inline-block rounded-l-md absolute flex items-center text-gray-700 justify-center left-0.5 top-0.5 bottom-0.5 w-max px-3 bg-gray-100">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    value={
                                                        formState?.delivery_charge ??
                                                        ""
                                                    }
                                                    onChange={
                                                        handleDeliveryCharge
                                                    }
                                                    placeholder="15"
                                                    className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                                />
                                            </div>
                                            {formErrMessages?.delivery_charge && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {
                                                        formErrMessages?.delivery_charge
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex-1 mr-8">
                                            <p className="text-xs mb-1 text-gray-600">
                                                Location Restriction (Optional)
                                            </p>
                                            <p className="text-xs font-light mb-2">
                                                Specify the places you can
                                                deliver to, regions, provinces,
                                                state etc. Or if delivery is{" "}
                                                <strong>worldwide</strong>, you
                                                can specify worldwide for short
                                            </p>
                                            <input
                                                value={
                                                    formState?.delivery_location_restriction ??
                                                    ""
                                                }
                                                onChange={
                                                    handleDeliveryLocationRestriction
                                                }
                                                placeholder="Only Lagos"
                                                className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                            />
                                        </div>
                                    </div>
                                </Transition>
                                <div className="flex items-center text-sm mb-4">
                                    <Switch
                                        onChange={handleSetInStoreOnly}
                                        className={`${
                                            inStoreOnly || bothOnlineAndInStore
                                                ? "bg-[#6d67e4]"
                                                : "bg-gray-200"
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span className="sr-only">
                                            Pick-up from store
                                        </span>
                                        <span
                                            className={`${
                                                inStoreOnly ||
                                                bothOnlineAndInStore
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                    <p className="ml-4">Pick-up from store</p>
                                </div>
                                <Transition
                                    leave="transition ease-in duration-100"
                                    leaveFrom="translate-y-[-100%]"
                                    leaveTo="translate-y-[0%]"
                                    show={inStoreOnly || bothOnlineAndInStore}
                                >
                                    <div className="flex-1 mr-8">
                                        <div className="flex flex-col mb-2">
                                            <p className="mr-1 text-xs text-gray-600 mb-1">
                                                Store Address
                                            </p>
                                            <p className="text-xs font-light">
                                                The physical location of your
                                                shop, so your customers can come
                                                pick up their orders.
                                            </p>
                                        </div>
                                        <input
                                            value={
                                                formState?.pickup_store_address ??
                                                ""
                                            }
                                            onChange={handlePickUpStoreAddress}
                                            placeholder="123 Maple Street, Anytown, USA, Zip Code: 98765"
                                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                        />
                                    </div>
                                    {formErrMessages?.pickup_store_address && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                formErrMessages?.pickup_store_address
                                            }
                                        </p>
                                    )}
                                </Transition>
                            </div>
                        </div>
                        <div className="flex flex-col w-full mb-6">
                            <p className="mb-2">Warranty</p>
                            <div className="w-full p-5 flex flex-col border border-slate-100 rounded-md shadow-md">
                                <div className="flex items-center text-sm">
                                    <Switch
                                        onChange={handleHasWarrantyChange}
                                        className={`${
                                            formState?.has_warranty
                                                ? "bg-[#6d67e4]"
                                                : "bg-gray-200"
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span className="sr-only">
                                            Has Warranty
                                        </span>
                                        <span
                                            className={`${
                                                formState?.has_warranty
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                    <p className="ml-4">Has Warranty</p>
                                </div>
                                <Transition
                                    leave="transition ease-in duration-100"
                                    leaveFrom="translate-y-[-100%]"
                                    leaveTo="translate-y-[0%]"
                                    show={!!formState?.has_warranty}
                                >
                                    <div className="flex-1 mr-8 mt-4">
                                        <div className="flex flex-col mb-2">
                                            <p className="mr-1 text-xs text-gray-600 mb-1">
                                                Warranty period
                                            </p>
                                            <p className="text-xs font-light">
                                                How long would you be able to
                                                provide free to subsidized
                                                repair and adjustment services
                                                in case of any malfunction?
                                            </p>
                                        </div>
                                        <MultiSelectInput
                                            items={warrantyPeriods}
                                            onSelect={
                                                handleWarrantyPeriodChange
                                            }
                                            multiple={false}
                                            initialItems={
                                                warrantyPeriods.filter(
                                                    (w) =>
                                                        w.id ===
                                                        formState?.warranty_period
                                                ) ?? []
                                            }
                                        />
                                    </div>
                                </Transition>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {formErrMessages?.product_images && (
                                <p className="text-red-500 text-xs my-1">
                                    {formErrMessages?.product_images}
                                </p>
                            )}
                            <ImagePicker
                                maxFiles={8}
                                description="Upload your images in a widely supported format like JPEG, PNG, or GIF. 
                        Large image files can slow down page loading speed. Consider resizing your images to an appropriate size for online display without compromising quality. 
                        Arrange the images in a logical sequence to guide your customer's decision starting with main images followed by supplementary images."
                                handleFileChange={handleFilesBannerChange}
                                title="Product Images"
                                dimensionInfo="rec. 400 * 850px"
                                presetBanners={transformBannerToMap(banners)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
