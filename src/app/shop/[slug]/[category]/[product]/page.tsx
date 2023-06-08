"use client";
import React from "react";
import { Rating } from "@components/Rating";
import { useGetLastPathname } from "@hooks/useGetLastPathname";
import {
    convertPathToSpaceSeparatedStr,
    formattedPriceInfo,
    spaceSeparatedStrToPath
} from "@lib/format-utils";

//dummy data
import products from "@data/products.json";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { VariationBox } from "../../components/VariationBox";
import { ProductQuantityInput } from "../../components/ProductQuantityInput";

//dummy function to get product detail
const getProduct = (productName: string) =>
    products.products.find(
        (p) => spaceSeparatedStrToPath(p.product) === productName
    );

export default function Product() {
    const productName = useGetLastPathname();
    const product = getProduct(productName);
    const [selectedVariations, setSelectedVariations] = React.useState<
        Map<string, string>
    >(new Map());
    if (!product) return <></>;
    const { discountedPrice, price } = formattedPriceInfo(
        product?.price,
        product?.discount
    );
    const handleVariationSelection = React.useCallback(
        (type: string, option: string) => {
            setSelectedVariations((prev) => new Map([...prev, [type, option]]));
        },
        []
    );

    return (
        <div className="flex flex-col gap-10">
            <div className="flex p-6 px-12 gap-10">
                <div className="flex flex-1 flex-col">
                    {/** carousel for product images */}
                    <div className="relative"></div>

                    {/** reviews */}
                    <div className=""></div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-col pb-3 border-b border-slate-200">
                        <h3 className="capitalize text-2xl font-semibold break-words">
                            {
                                convertPathToSpaceSeparatedStr(product.product)
                                    .fmt
                            }
                        </h3>
                        <div className="flex items-center mt-1">
                            {product.review ? (
                                <>
                                    <div className="flex items-center">
                                        <Rating rating={product.review.score} />
                                        <p className="text-base ml-1 text-gray-500">
                                            {product.review.score}
                                        </p>
                                    </div>
                                    <span className="h-5 w-px bg-gray-300 mx-2" />
                                    <p className="text-sm text-gray-500">
                                        {product.review.count} Reviews
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No reviews yet
                                </p>
                            )}
                        </div>
                        <div className="flex items-center mt-1">
                            {!!Number(product.inventoryCount) ? (
                                <div className="flex items-center">
                                    <p className="text-xs font-light text-green-700">
                                        Stock Available
                                    </p>
                                    <span className="h-5 w-px bg-gray-300 mx-2" />
                                    <p className="text-sm text-gray-500">
                                        {product.inventoryCount} units
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs font-light text-red-700">
                                    Sold out
                                </p>
                            )}
                        </div>
                        <div className="flex items-center mt-1">
                            {product.discount ? (
                                <span className="mr-2 inline-flex items-center justify-center bg-[#CEE5D0] rounded-full py-0.5 px-1">
                                    <CheckBadgeIcon className="h-5 w-5 text-green-700 mr-0.5" />
                                    <p className="text-xs text-green-700">
                                        {product.discount}%
                                    </p>
                                </span>
                            ) : null}
                            <p className="text-sm text-gray-400 line-through">
                                {price}
                            </p>
                            <p className="ml-2 text-lg font-semibold">
                                {product.discount ? discountedPrice : price}
                            </p>
                        </div>
                        <div className="flex items-center mt-1">
                            <p className="text-gray-700 text-sm">
                                {product.delivery.free
                                    ? "Free shipping"
                                    : `Shipping from ${product.delivery.cost.toLocaleString(
                                          "en-US",
                                          {
                                              style: "currency",
                                              currency: "USD",
                                              minimumFractionDigits: 2
                                          }
                                      )}`}
                            </p>
                        </div>
                    </div>
                    {product.variations ? (
                        <div className="mt-4 border-b pb-3 border-slate-200">
                            {Object.entries(product.variations).map(
                                ([type, options], i) => (
                                    <div className="">
                                        <p className="capitalize mb-2">
                                            Select {type}
                                        </p>
                                        <VariationBox
                                            type={type}
                                            options={options}
                                            onSelect={handleVariationSelection}
                                            selectedOption={selectedVariations.get(
                                                type
                                            )}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    ) : null}
                    <div className="mt-4 flex">
                        <div className="flex items-end gap-10 flex-1">
                            <div className="flex flex-col flex-1">
                                <p className="mb-2">Quantity</p>
                                <ProductQuantityInput isCancelable={false} />
                            </div>
                            <button className="text-white bg-indigo-500 transition border-[#6d67e4] hover:bg-[#6d67e4] flex-1 h-9">
                                Add to bag
                            </button>
                        </div>
                        <div className="flex-1"></div>
                    </div>
                    <div className="flex mt-6 flex-col">
                        <p className="mb-2">Description</p>
                        <p className="text-gray-600">{product.description}</p>
                    </div>
                    {product.address ? (
                        <div className="flex mt-6 flex-col">
                            <p className="mb-2">Pickup Address Information</p>
                            <p className="text-gray-600">{product.address}</p>
                        </div>
                    ) : null}
                </div>
            </div>
            {/** related products */}
            <div></div>
        </div>
    );
}
