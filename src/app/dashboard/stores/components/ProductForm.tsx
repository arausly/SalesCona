"use client";
import React from "react";
import { Breadcrumb } from "@components/Breadcrumb";
import { Switch, Transition } from "@headlessui/react";
import { CheckIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { convertPathToSpaceSeparatedStr } from "@lib/format-utils";
import { usePathname } from "next/navigation";
import { ImagePicker } from "./ImagePicker";
import { CategorySelectInput } from "./CategorySelectInput";
import { ProductVariantForm } from "./ProductVariantForm";

interface ProductFormProps {
    isEditForm: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ isEditForm }) => {
    const [deliveryAvailable, setDeliveryAvailable] =
        React.useState<boolean>(false);
    const [onlineStoreOnly, setOnlineStoreOnly] = React.useState(false);
    const [inStoreOnly, setInStoreOnly] = React.useState<boolean>(false);
    const [variantOptions, setVariantOptions] = React.useState<
        Map<number, string>
    >(new Map());
    const pathname = usePathname();
    const [, , , storePath, , productPath] = pathname.split("/");

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
            link: `dashboard/stores/${storePath}`
        },
        {
            name: "New Product"
        }
    ];

    const handleAddVariant = React.useCallback(() => {
        setVariantOptions((prev) => new Map([...prev, [prev.size, ""]]));
    }, []);

    const removeValue = React.useCallback((optionIndex: number) => {
        setVariantOptions((prev) => {
            prev.delete(optionIndex);
            return new Map([...prev]);
        });
    }, []);

    return (
        <section className="p-6 flex flex-col w-full h-full dashboard-screen-height overflow-auto">
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
                    <div className="flex flex-col w-full mb-6">
                        <p className="mb-2">Description</p>
                        <div className="w-full p-5 flex flex-col border border-slate-100 rounded-md shadow-md">
                            <div className="flex flex-col mb-6">
                                <div className="flex mb-1">
                                    <p className="mr-1">Name</p>
                                    <span className="text-[#6d67e4]">*</span>
                                </div>
                                <p className="text-xs font-light mb-1">
                                    20 characters max
                                </p>
                                <input
                                    type="text"
                                    id="table-search"
                                    placeholder="What would you call this product"
                                    className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                />
                            </div>
                            <div className="flex flex-col">
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
                        </div>
                    </div>
                    <div className="flex flex-col w-full mb-6">
                        <p className="mb-2">Inventory</p>
                        <div className="w-full p-5 flex items-center border border-slate-100 rounded-md shadow-md">
                            <div className="mr-8">
                                <p className="text-xs mb-2 text-gray-600">
                                    Quantity
                                </p>
                                <input
                                    type="number"
                                    placeholder="250"
                                    className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs mb-2 text-gray-600">
                                    SKU (Optional)
                                </p>
                                <input
                                    placeholder="AQR-UT-PUT-09"
                                    className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full mb-6">
                        <p className="mb-2">Selling Type</p>
                        <div className="w-full p-5 flex flex-col border border-slate-100 rounded-md shadow-md">
                            <div className="flex items-center text-sm mb-4">
                                <Switch
                                    onChange={setOnlineStoreOnly}
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
                                    onChange={setInStoreOnly}
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
                                <p className="ml-4">In-store selling only</p>
                            </div>
                            <div className="flex items-center text-sm">
                                <Switch
                                    onChange={(checked) => {
                                        setInStoreOnly(checked);
                                        setOnlineStoreOnly(checked);
                                    }}
                                    className={`${
                                        onlineStoreOnly && inStoreOnly
                                            ? "bg-[#6d67e4]"
                                            : "bg-gray-200"
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                                >
                                    <span className="sr-only">
                                        Selling online only
                                    </span>
                                    <span
                                        className={`${
                                            onlineStoreOnly && inStoreOnly
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
                                <p className="mr-1 text-xs text-gray-600">
                                    Product Category
                                </p>
                                <CategorySelectInput onSelect={() => {}} />
                            </div>
                            <div className="flex w-full justify-between items-center mb-6">
                                <div className="flex flex-col">
                                    <p className="mr-1 text-xs text-gray-600 mb-1">
                                        Product variants
                                    </p>
                                    <p className="text-xs font-light">
                                        What other possible type of this product
                                        do you have? e.g color, size, gender etc
                                    </p>
                                </div>

                                <div
                                    className="flex items-center text-xs cursor-pointer"
                                    onClick={handleAddVariant}
                                >
                                    <PlusIcon className="h-4 w-4 text-[#6d67e4] mr-1" />
                                    <p className="text-[#6d67e4]">
                                        Add Variant
                                    </p>
                                </div>
                            </div>
                            <div>
                                {Array.from(variantOptions.values()).map(
                                    (optionVal, i) => (
                                        <ProductVariantForm
                                            key={i}
                                            removeVariant={() => removeValue(i)}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full mb-6">
                        <p className="mb-2">Pricing</p>
                        <div className="w-full p-5 flex items-center border border-slate-100 rounded-md shadow-md">
                            <div className="flex-1 mr-8">
                                <p className="text-xs mb-2 text-gray-600">
                                    Price
                                </p>
                                <div className="w-full relative">
                                    <span className="inline-block rounded-l-md absolute flex items-center text-gray-700 justify-center left-0.5 top-0.5 bottom-0.5 w-max px-3 bg-gray-100">
                                        $
                                    </span>
                                    <input
                                        placeholder="200"
                                        className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                    />
                                </div>
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
                                        placeholder="10"
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
                                    onChange={() =>
                                        setDeliveryAvailable((c) => !c)
                                    }
                                    className={`${
                                        deliveryAvailable
                                            ? "bg-[#6d67e4]"
                                            : "bg-gray-200"
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                                >
                                    <span className="sr-only">
                                        Delivery Available
                                    </span>
                                    <span
                                        className={`${
                                            deliveryAvailable
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
                                show={deliveryAvailable}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="flex-1 mr-8">
                                        <p className="text-xs mb-2 text-gray-600">
                                            Additional Charge (Optional)
                                        </p>
                                        <div className="w-full relative">
                                            <span className="inline-block rounded-l-md absolute flex items-center text-gray-700 justify-center left-0.5 top-0.5 bottom-0.5 w-max px-3 bg-gray-100">
                                                $
                                            </span>
                                            <input
                                                placeholder="200"
                                                className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 mr-8">
                                        <p className="text-xs mb-2 text-gray-600">
                                            Location Restriction (Optional)
                                        </p>
                                        <input
                                            placeholder="Only Lagos"
                                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                        />
                                    </div>
                                </div>
                            </Transition>
                            <div className="flex items-center text-sm mb-4">
                                <Switch
                                    onChange={() =>
                                        setDeliveryAvailable((c) => !c)
                                    }
                                    className={`${
                                        !deliveryAvailable
                                            ? "bg-[#6d67e4]"
                                            : "bg-gray-200"
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                                >
                                    <span className="sr-only">
                                        Pick-up from store
                                    </span>
                                    <span
                                        className={`${
                                            !deliveryAvailable
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                    />
                                </Switch>
                                <p className="ml-4">Pick-up from store</p>
                            </div>
                        </div>
                    </div>
                    <ImagePicker
                        maxFiles={8}
                        description="Upload your images in a widely supported format like JPEG, PNG, or GIF. 
                        Large image files can slow down page loading speed. Consider resizing your images to an appropriate size for online display without compromising quality. 
                        Arrange the images in a logical sequence to guide your customer's decision starting with main images followed by supplementary images."
                        handleFileChange={() => {}}
                        title="Product Images"
                        dimensionInfo="rec. 400 * 850px"
                    />
                </div>
            </div>
        </section>
    );
};
