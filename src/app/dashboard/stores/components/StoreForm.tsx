"use client";
import React from "react";
import Image from "next/image";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    CheckIcon,
    FolderIcon,
    PencilIcon,
    PhotoIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { copyToClipboard, generateShopAlias } from "@lib/common.utils";
import MultiSelectInput, {
    MultiSelectProps,
} from "@components/Input/MultiSelectInput";
import FileWidget, { FileWithPreview } from "@components/FileWidget";

//dummy data
import predefinedCategories from "@data/categories.json";

//styles
import styles from "../styles/store-create.module.css";
import { formatByteToSize, getCurrencies } from "@lib/format-utils";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "@components/Breadcrumb";

interface StoreFormProps {
    isEditForm: boolean; //todo change to correct type
}

export const StoreForm: React.FC<StoreFormProps> = ({ isEditForm }) => {
    const [storeName, setStoreName] = React.useState<string>("");
    const [categories, setCategories] = React.useState(
        predefinedCategories.entries
    );
    const [copyBtnText, setCopyBtnText] = React.useState<"Copy" | "Copied!">(
        "Copy"
    );
    const [aboveFoldBanners, setAboveFoldBanners] = React.useState<
        Map<number, FileWithPreview>
    >(new Map());
    const [currentAboveFoldBannerIndex, setCurrentAboveFoldBannerIndex] =
        React.useState<number>(0);
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
            link: "/dashboard/stores",
        },
        {
            name: storePath.split("-").join(" "),
            link: `dashboard/stores/${storePath}`,
        },
        {
            name: "Edit",
        },
    ];

    const createFormCrumbs = [
        {
            name: "Stores",
            link: "/dashboard/stores",
        },
        {
            name: "New Store",
        },
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

    const handleBannerInputChange = React.useCallback(
        (files: FileWithPreview[]) => {
            /** if the files are multiple  spread across the indexes, else */
            setAboveFoldBanners(
                (prevBanners) =>
                    new Map([
                        ...prevBanners,
                        ...files
                            .slice(0, 4 - currentAboveFoldBannerIndex)
                            .map(
                                (f, i) =>
                                    [currentAboveFoldBannerIndex + i, f] as [
                                        number,
                                        FileWithPreview
                                    ]
                            ),
                    ])
            );
        },
        [currentAboveFoldBannerIndex]
    );

    //todo this should call real api to update predefined categories
    const handleCreateNewItem = React.useCallback(
        (label: string) => {
            const newCategory = {
                label,
                id: `${categories.length + 1}`,
            };
            setCategories((prev) => [...prev, newCategory]);
            return newCategory;
        },
        [categories.length]
    );

    const handleBannerNavigation = React.useCallback(
        (direction: "forward" | "backward") => {
            setCurrentAboveFoldBannerIndex((prevIndex) =>
                direction === "backward"
                    ? Math.max(0, prevIndex - 1)
                    : Math.min(3, prevIndex + 1)
            );
        },
        []
    );

    const handleRemoveBannerSlide = React.useCallback(
        (removeBannerIndex: number) => {
            setAboveFoldBanners((prev) => {
                prev.delete(removeBannerIndex);
                return new Map([...prev]);
            });
        },
        []
    );

    return (
        <div className="p-6 flex flex-col w-full">
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
                            onSelect={() => { }}
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
                        <MultiSelectInput
                            items={categories}
                            onSelect={() => { }}
                            createNewItem={handleCreateNewItem}
                        />
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
                <div className="flex-1 px-0 md:px-6 order-first mb-6 md:mb-0 md:order-last overflow-y-auto border-0 md:border-l md:border-slate-100">
                    <div className="flex flex-col">
                        {/** slider and dropbox */}
                        <div className="flex relative h-80">
                            {currentAboveFoldBannerIndex !== 0 ? (
                                <div
                                    className="absolute z-10 cursor-pointer top-1/2 left-[-1.25rem] w-10 h-10 flex items-center justify-center text-white primary-bg rounded-full"
                                    onClick={() =>
                                        handleBannerNavigation("backward")
                                    }
                                >
                                    <ArrowLongLeftIcon className="h-5 w-5" />
                                </div>
                            ) : null}

                            {currentAboveFoldBannerIndex !== 3 ? (
                                <div
                                    className="absolute z-10 cursor-pointer right-[-1.25rem] top-1/2  w-10 h-10 flex items-center justify-center text-white primary-bg rounded-full"
                                    onClick={() =>
                                        handleBannerNavigation("forward")
                                    }
                                >
                                    <ArrowLongRightIcon className="h-5 w-5" />
                                </div>
                            ) : null}
                            <div className="flex flex-col w-full">
                                <div className="flex mb-1">
                                    <p className="mr-1">Shop banner slides</p>
                                    <span className="text-[#6d67e4]">*</span>
                                </div>
                                <p className="text-xs font-light mb-2">
                                    Customize your page by adding beautiful
                                    banner slides that makes your page unique.
                                    you can add up to 4 slides that describe
                                    your product offerings, promo, discounts,
                                    new stock etc
                                </p>
                                {/**Image picker */}
                                <FileWidget
                                    maxFiles={4}
                                    handleFiles={handleBannerInputChange}
                                    className="w-full relative h-full border flex flex-col justify-center items-center border-slate-200 border-dashed rounded-md cursor-pointer"
                                >
                                    <div className="z-20 absolute rounded-l-lg right-0 top-0 bg-gray-800 flex items-center justify-center h-6 w-14 shadow-md">
                                        <p className="text-white">
                                            {currentAboveFoldBannerIndex + 1} of
                                            4
                                        </p>
                                    </div>
                                    {aboveFoldBanners.has(
                                        currentAboveFoldBannerIndex
                                    ) ? (
                                        <div className="w-full h-full relative">
                                            <Image
                                                src={
                                                    aboveFoldBanners.get(
                                                        currentAboveFoldBannerIndex
                                                    )?.preview!
                                                }
                                                alt="above fold banner"
                                                fill
                                                className={`${styles.aboveFoldBannerAnimation} w-full h-full object-cover rounded-md`}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center p-6">
                                            <div className="h-20 w-20 flex items-center rounded-md justify-center bg-slate-50">
                                                <PhotoIcon className="h-11 w-11 text-slate-900" />
                                            </div>
                                            <p className="text-sm text-slate-600 mt-3">
                                                Drag & drop or
                                                <a className="ml-1 text-[#6d67e4]">
                                                    Choose file
                                                </a>{" "}
                                                to upload
                                            </p>
                                            <p className="text-xs text-slate-400 mt-3">
                                                SVG, PNG, JPG, or GIF (rec. 1200
                                                * 1000px)
                                            </p>
                                        </div>
                                    )}
                                </FileWidget>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <FolderIcon className="w-5 h-5 mr-2 text-gray-500" />
                            <p className="text-gray-500">
                                Files ({aboveFoldBanners.size} of 4 )
                            </p>
                        </div>
                        <div className="mt-4 flex flex-wrap">
                            {Array.from(aboveFoldBanners.entries()).map(
                                (banner, index) => (
                                    <div
                                        key={index}
                                        className="flex h-20 w-full md:w-2/5 rounded-md shadow-md mb-4 md:mr-4 p-2"
                                    >
                                        <Image
                                            src={banner[1].preview}
                                            alt="banner"
                                            width={80}
                                            height={80}
                                            className="object-cover rounded-md"
                                        />
                                        <div className="flex flex-col ml-2">
                                            <p className="text-xs text-gray-800 mb-2 text-ellipsis overflow-hidden">
                                                {banner[1].name}
                                            </p>
                                            <p className="text-xs text-gray-700">
                                                {formatByteToSize(
                                                    banner[1].size
                                                )}
                                            </p>
                                        </div>
                                        <div
                                            className="flex ml-auto flex-col items-center justify-center w-8 h-8 hover:bg-red-100"
                                            onClick={() =>
                                                handleRemoveBannerSlide(index)
                                            }
                                        >
                                            <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer" />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
