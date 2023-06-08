"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

export const ProductQuantityInput = ({
    isCancelable = true
}: {
    isCancelable?: boolean;
}) => {
    const [quantity, setQuantity] = React.useState<number>(1);
    return (
        <div className="flex h-9 flex-row">
            {isCancelable && (
                <button
                    aria-label="Remove cart item"
                    className="ease mr-2 flex min-w-[36px] max-w-[36px] items-center justify-center border px-2 transition-all duration-200 hover:border-gray-800 hover:bg-gray-100"
                >
                    <XMarkIcon className="hover:text-accent-3 mx-[1px] h-4 w-4" />
                </button>
            )}
            <p className="flex w-full items-center justify-center border">
                <span className="w-full px-2">{quantity}</span>
            </p>
            <button
                aria-label="Reduce item quantity"
                onClick={() => setQuantity((q) => Math.max(1, --q))}
                className="ease flex min-w-[36px] max-w-[36px] items-center justify-center border px-2 transition-all duration-200 hover:border-gray-800 hover:bg-gray-100 ml-auto"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    shapeRendering="geometricPrecision"
                    className="h-4 w-4"
                >
                    <path d="M5 12H19"></path>
                </svg>
            </button>
            <button
                aria-label="Increase item quantity"
                onClick={() => setQuantity((q) => ++q)}
                className="ease flex min-w-[36px] max-w-[36px] items-center justify-center border px-2 transition-all duration-200 hover:border-gray-800 hover:bg-gray-100"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    shapeRendering="geometricPrecision"
                    className="h-4 w-4"
                >
                    <path d="M12 5V19"></path>
                    <path d="M5 12H19"></path>
                </svg>
            </button>
        </div>
    );
};
