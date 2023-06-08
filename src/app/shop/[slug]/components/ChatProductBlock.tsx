"use client";
import React from "react";

//dummy data
import products from "@data/products.json";

//dummy images
import shirt from "@assets/images/shirts.webp";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ProductQuantityInput } from "./ProductQuantityInput";

//shop/the-lord-of-the-rings/{category}/${product}
export const ChatProductBlock = () => {
    const pathname = usePathname();
    const [, , shopName] = pathname.split("/");

    return (
        <div className="h-96 bg-white shadow-md rounded-sm m-4 p-4">
            <p className="font-semibold">
                Purchases ({products.products.length})
            </p>
            {/** product pane */}
            <div className="overflow-auto h-3/5">
                {products.products.map((product) => (
                    <div key={product.product} className="flex flex-col mb-4">
                        <div className="flex items-center justify-between py-4">
                            <Link href={`/shop/${shopName}${product.urlPath}`}>
                                <div className="h-16 w-16 cursor-pointer overflow-hidden bg-white">
                                    <Image
                                        src={shirt}
                                        alt="product shirt"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </Link>
                            <div className="flex-1">
                                {/** product name */}
                                <p className="font-semibold mb-0.5">
                                    {product.product}
                                </p>
                                {/**product variants */}
                                <div className="flex items-center flex-wrap">
                                    {product.variants.map((variant, i) => (
                                        <div
                                            className="flex items-center mr-0.5"
                                            key={variant}
                                        >
                                            <p className="text-sm">{variant}</p>
                                            {i !== product.variants.length - 1
                                                ? ","
                                                : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm">$25.00</p>
                        </div>
                        <ProductQuantityInput />
                    </div>
                ))}
            </div>
            {/** footer checkout */}
            <div className="flex flex-col mt-4">
                <div className="flex flex-col border-t pt-2 border-[#6d67e4]">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm">Subtotal</p>
                        <p className="text-sm">$345.00</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm">Delivery</p>
                        <p className="text-sm">$5.00</p>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-2 border-t pt-2 mt-1 border-[#6d67e4]">
                    <p className="font-semibold text-sm">Total</p>
                    <p className="font-semibold text-sm">$350.00</p>
                </div>
            </div>
        </div>
    );
};
