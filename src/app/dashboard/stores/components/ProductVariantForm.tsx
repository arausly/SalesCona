import { PlusIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

interface ProductVariantForm {
    removeVariant: () => void;
}

export const ProductVariantForm: React.FC<ProductVariantForm> = ({
    removeVariant
}) => {
    const [variantOptions, setVariantOptions] = React.useState<
        Map<number, string>
    >(new Map([[0, ""]]));

    const handleAddValue = React.useCallback(() => {
        setVariantOptions((prev) => new Map([...prev, [prev.size, ""]]));
    }, []);

    const removeValue = React.useCallback((optionIndex: number) => {
        setVariantOptions((prev) => {
            prev.delete(optionIndex);
            return new Map([...prev]);
        });
    }, []);

    const handleEditVariantOption = React.useCallback(
        (e: any, optionIndex: number) => {
            setVariantOptions(
                (prev) => new Map([...prev, [optionIndex, e.target.value]])
            );
        },
        []
    );

    return (
        <div className="flex flex-col mb-6">
            <div className="flex flex-col mb-3">
                <p className="text-xs mb-2 text-gray-600">Option name</p>
                <div className="flex items-center">
                    <input
                        placeholder="What other type of this product do you offer"
                        className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                    />
                    <div
                        className="hover:bg-red-100 flex items-center justify-center ml-3 w-8 h-8"
                        onClick={removeVariant}
                    >
                        <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer " />
                    </div>
                </div>
            </div>
            <div>
                <p className="text-xs mb-2 text-gray-600">Option values</p>
                {Array.from(variantOptions.values()).map((optionVal, i) => (
                    <div className="w-full flex items-center mb-4">
                        <input
                            key={i}
                            placeholder={`value ${i + 1}`}
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                            value={optionVal}
                            onChange={(e) => handleEditVariantOption(e, i)}
                        />
                        <div
                            className="hover:bg-red-100 flex items-center rounded-full justify-center ml-3 w-8 h-8"
                            onClick={() => removeValue(i)}
                        >
                            <XCircleIcon className="w-5 h-5  text-red-500 cursor-pointer " />
                        </div>
                    </div>
                ))}
                <div
                    className="mt-3 flex items-center cursor-pointer"
                    onClick={handleAddValue}
                >
                    <PlusIcon className="h-4 w-4 text-[#6d67e4] mr-1" />
                    <p className="text-[#6d67e4] text-xs">Add another value</p>
                </div>
            </div>
        </div>
    );
};
