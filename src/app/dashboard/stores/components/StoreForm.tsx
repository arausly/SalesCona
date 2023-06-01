"use client";
import React from "react";
import Image from "next/image";
import { CheckIcon, PencilIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { copyToClipboard, generateShopAlias } from "@lib/common.utils";
import MultiSelectInput, {
    MultiSelectProps
} from "@components/Input/MultiSelectInput";
import FileWidget, { FileWithPreview } from "@components/FileWidget";

//styles
import { getCurrencies } from "@lib/format-utils";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "@components/Breadcrumb";
import { ImagePicker } from "./ImagePicker";
import { CategorySelectInput } from "./CategorySelectInput";

const imagePickerBannerDesc =
    "Customize your page by adding beautiful banner slides that makes your page unique. you can add up to 4 slides that describe your product offerings, promo, discounts, new stock etc. Make sure the logo and the background banners contrast well for appealing aesthetics";

interface StoreFormProps {
    isEditForm: boolean; //todo change to correct type
}

export const StoreForm: React.FC<StoreFormProps> = ({ isEditForm }) => {
    const [storeName, setStoreName] = React.useState<string>("");

    const [copyBtnText, setCopyBtnText] = React.useState<"Copy" | "Copied!">(
        "Copy"
    );
    const [shopLogo, setShopLogo] = React.useState<FileWithPreview>();
    const timeoutId = React.useRef<ReturnType<typeof setTimeout> | undefined>();
    const shopUrl = `${window.location.origin}/shop/${generateShopAlias(
        storeName
    )}`;
    const pathname = usePathname();
    const [storePath] = pathname.split("/").slice(-2);
    const currencies = React.useRef<MultiSelectProps["items"]>(getCurrencies());

    const editFormCrumbs = [
        {
            name: "Stores",
            link: "/dashboard/stores"
        },
        {
            name: storePath.split("-").join(" "),
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

    return (
        <div className="p-6 flex flex-col w-full dashboard-screen-height overflow-auto">
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
                        <button className="w-28 h-10 rounded-full bg-white hover:bg-slate-100 transition mr-4 border border-slate-200 shadow-md flex justify-center items-center">
                            <PencilIcon className="h-4 w-4 mr-2 text-gray-700" />
                            <p className="text-gray-700 text-sm">Save draft</p>
                        </button>
                        <button className="w-28 h-10 rounded-full primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center">
                            <CheckIcon className="h-5 w-5 text-white mr-2" />
                            <p className="text-white text-sm">Publish</p>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row w-full mt-6">
                <div className="flex-1 order-last md:px-6 md:order-first h-full overflow-auto">
                    <div className="flex flex-col mb-6">
                        <div className="flex mb-1">
                            <p className="mr-1">Currency</p>
                            <span className="text-[#6d67e4]">*</span>
                        </div>
                        <MultiSelectInput
                            items={currencies.current}
                            onSelect={() => {}}
                            multiple={false}
                        />
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
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="What would you call your new store?"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                        />
                    </div>
                    <div className="flex flex-col mb-6">
                        <p className="mr-1 mb-1">Shop website link</p>
                        <p className="text-xs font-light mb-1">
                            As soon as you publish your store this website link
                            would be public and can be accessed by your
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
                                id="table-search"
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
                            placeholder="The clearer and shorter the better"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                        />
                    </div>
                    <div className="flex flex-col mb-6">
                        <p className="mr-1 mb-1">Shop logo</p>
                        <p className="text-xs font-light mb-2">
                            You can add a logo to stand out from the crowd and
                            personalize your shop page to look very professional
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
                                                Upload a logo that makes your
                                                brand stand out
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                SVG, PNG, JPG, or GIF (rec. 700
                                                * 430px)
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
                            Basically, the products you sell, what category can
                            you group them in for this store, you can select
                            multiple categories as applicable. Note this might
                            to certain degree influence your visibility ranking
                            in the future.
                        </p>
                        <CategorySelectInput onSelect={() => {}} />
                    </div>
                    <div className="mb-6">
                        <div className="flex flex-col mb-1">
                            <p className="mr-1">Instagram page</p>
                            <p className="text-xs font-light mb-1">
                                Please provide the instagram page for this store
                                if available
                            </p>
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md overflow-hidden text-ellipsis"
                        />
                    </div>
                    <div className="mb-6">
                        <div className="flex flex-col mb-1">
                            <p className="mr-1">Facebook page</p>
                            <p className="text-xs font-light mb-1">
                                Please provide the facebook page for this store
                                if available
                            </p>
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md overflow-hidden text-ellipsis"
                        />
                    </div>
                    <div className="mb-6">
                        <div className="flex flex-col mb-1">
                            <p className="mr-1">Twitter page</p>
                            <p className="text-xs font-light mb-1">
                                Please provide the twitter page for this store
                                if available
                            </p>
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md overflow-hidden text-ellipsis"
                        />
                    </div>
                </div>
                <div className="flex-none md:flex-1 px-0 md:px-6 order-first mb-6 md:mb-0 md:order-last overflow-y-auto border-0 md:border-l md:border-slate-100">
                    <ImagePicker
                        description={imagePickerBannerDesc}
                        title="Shop banner slides"
                        maxFiles={4}
                        dimensionInfo="rec. 1200 * 1000px"
                        handleFileChange={() => {}}
                        logo={shopLogo}
                    />
                </div>
            </div>
        </div>
    );
};
