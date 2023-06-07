"use client";
import React from "react";
import Image from "next/image";
import { CustomerProduct } from "../typing";

//dummy image
import shirt from "@assets/images/shirts.webp";
import Link from "next/link";
import { useGetShopName } from "@hooks/useGetShopName";
import { spaceSeparatedStrToPath } from "@lib/format-utils";
import { Rating } from "@components/Rating";
import { Tooltip } from "@components/BottomTooltip";
import { BellIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

interface ProductCardProps {
    product: CustomerProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const shopName = useGetShopName();
    const [loading, setLoading] = React.useState<boolean>(false);
    return (
        <div className="flex flex-col h-80 w-60 rounded-md shadow-md overflow-hidden">
            {/** product image box */}
            <Link
                href={`/shop/${shopName}/${
                    product.category
                }/${spaceSeparatedStrToPath(product.product)}`}
                className="inline-block h-2/3 bg-gray-50 rounded-t-md relative cursor-pointer overflow-hidden"
            >
                <Image
                    src={shirt}
                    alt="product"
                    className="object-contain transition duration-300 ease-in-out hover:scale-105"
                />
                {product.discount && (
                    <span className="absolute top-2 left-2 inline-flex rounded-md flex items-center justify-center bg-red-500 py-1 px-2">
                        <p className="text-white text-sm">
                            -{product.discount}%
                        </p>
                    </span>
                )}
            </Link>
            <div className="flex flex-col p-3 h-1/3 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm capitalize overflow-hidden whitespace-nowrap text-ellipsis">
                            {product.product}
                        </p>
                        <p className="text-sm capitalize overflow-hidden whitespace-nowrap text-ellipsis">
                            {product.category}
                        </p>
                    </div>
                    <div
                        className="flex relative items-center justify-center cursor-pointer group transition ease-in-out"
                        onClick={() => setLoading(true)}
                    >
                        {!!Number(product.inventoryCount) ? (
                            <Tooltip pos="left" message="Add to bag">
                                <ShoppingBagIcon className="h-5 w-5 transition group-hover:font-bold group-hover:scale-125" />
                            </Tooltip>
                        ) : (
                            <Tooltip pos="left" message="Know when we restock">
                                <BellIcon className="h-5 w-5 transition group-hover:font-bold group-hover:scale-125" />
                            </Tooltip>
                        )}
                        {loading && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
                        )}
                    </div>
                </div>

                {/* review count */}
                <div className="flex items-center justify-between">
                    {product.review ? (
                        <div className="flex items-center">
                            <Rating
                                rating={product.review.score}
                                size="small"
                            />
                            <p className="text-xs ml-1 text-gray-500">
                                ({product.review.count})
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">No reviews yet</p>
                    )}
                    {!!Number(product.inventoryCount) ? (
                        <p className="text-xs font-light text-green-700">
                            Stock Available
                        </p>
                    ) : (
                        <p className="text-xs font-light text-red-700">
                            Sold out
                        </p>
                    )}
                </div>
                <div className="flex items-center">
                    <p className="mr-2">
                        $
                        {product.discount
                            ? (
                                  Number(product.price) -
                                  (Number(product.discount) / 100) *
                                      Number(product.price)
                              ).toFixed(2)
                            : product.price}
                    </p>
                    {product.discount && (
                        <p className="text-xs text-gray-400 line-through">
                            {product.price}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
