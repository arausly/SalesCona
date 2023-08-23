import { PlusIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Product } from "../typing";

interface ProductVariantForm {
    removeVariant: (variantKey: string) => void;
    handleVariantNameChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        variantKey: string
    ) => void;
    handleEditVariantOption: (
        e: React.ChangeEvent<HTMLInputElement>,
        variantKey: string,
        valueKey: string
    ) => void;
    removeVariantValue: (variantKey: string, valueKey: string) => void;
    handleAddValue: () => void;
    variantName: string;
    variantKey: string;
    values?: Map<string, string>;
}

export const ProductVariantForm: React.FC<ProductVariantForm> = (props) => {
    return (
        <div className="flex flex-col mb-6">
            <div className="flex flex-col mb-3">
                <p className="text-xs mb-2 text-gray-600">Option name</p>
                <div className="flex items-center">
                    <input
                        onChange={(e) =>
                            props.handleVariantNameChange(e, props.variantKey)
                        }
                        value={props.variantName ?? ""}
                        placeholder="What other type of this product do you offer"
                        className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                    />
                    <div
                        className="hover:bg-red-100 rounded-lg flex items-center justify-center ml-3 w-8 h-8"
                        onClick={() => props.removeVariant(props.variantKey)}
                    >
                        <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer " />
                    </div>
                </div>
            </div>
            <div>
                {(props.values?.size && (
                    <>
                        <p className="text-xs mb-2 text-gray-600">
                            Option values
                        </p>
                        {Array.from(props.values.entries()).map(
                            ([key, val], i) => (
                                <div className="w-full flex items-center mb-4">
                                    <input
                                        key={key}
                                        placeholder={`value ${i + 1}`}
                                        className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                                        value={val}
                                        onChange={(e) =>
                                            props.handleEditVariantOption(
                                                e,
                                                props.variantKey,
                                                key
                                            )
                                        }
                                    />
                                    <div
                                        className="hover:bg-red-100 flex items-center rounded-full justify-center ml-3 w-8 h-8"
                                        onClick={() =>
                                            props.removeVariantValue(
                                                props.variantKey,
                                                key
                                            )
                                        }
                                    >
                                        <XCircleIcon className="w-5 h-5  text-red-500 cursor-pointer " />
                                    </div>
                                </div>
                            )
                        )}
                    </>
                )) ||
                    null}
                <div
                    className="mt-3 flex items-center cursor-pointer"
                    onClick={props.handleAddValue}
                >
                    <PlusIcon className="h-4 w-4 text-[#6d67e4] mr-1" />
                    <p className="text-[#6d67e4] text-xs">
                        {props.values?.size ? "Add another value" : "Add value"}
                    </p>
                </div>
            </div>
        </div>
    );
};
