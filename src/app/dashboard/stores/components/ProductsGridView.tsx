"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Product } from "../typing";
import { ProductStatus } from "./ProductStatus";
import { formatNumberWithSuffix } from "@lib/format-utils";
import { PencilIcon } from "@heroicons/react/24/outline";

//images
import shirt from "@assets/images/shirts.webp";
import { Spinner } from "@components/Spinner";

const ProductCard = ({
    product,
    loading
}: {
    product: Product;
    loading: boolean;
}) => {
    const pathname = usePathname();

    if (loading)
        return (
            <div className="flex items-center justify-center my-4">
                <Spinner size="large" />
            </div>
        );

    return (
        <div className="flex flex-col w-96 mb-8 rounded-md border border-slate-100 shadow-md relative">
            <Link
                href={`/dashboard/stores/${
                    pathname.split("/").slice(-1)[0]
                }/products/${product.slug}`}
                className="absolute top-4 right-4 flex justify-center items-center cursor-pointer h-10 w-10 transition ease-in-out bg-white hover:bg-slate-50 shadow-md rounded-full"
            >
                <PencilIcon className="h-5 w-5 text-[#6d67e4]" />
            </Link>
            <div className="w-full flex-1">
                <Image
                    src={JSON.parse(product.product_images ?? "[]")[0] ?? shirt}
                    className="object-cover"
                    height={450}
                    width={450}
                    alt="shirt"
                />
            </div>
            <div className="px-8 py-4">
                <ProductStatus
                    status={product.isPublished ? "published" : "draft"}
                />
                <p className="mt-2">{product.name}</p>
                <span className="inline-block h-0.5 w-full bg-slate-100" />
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600">Price</p>
                        <p>${product.pricing}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Inventory</p>
                        <p>{product.inventory_count || 0}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Views</p>
                        <p>
                            {formatNumberWithSuffix(
                                Number(product.views_count ?? 0)
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProductsGridView = ({
    products,
    loading
}: {
    products: Array<Product>;
    loading: boolean;
}) => {
    return (
        <div className="flex justify-center gap-4 flex-wrap">
            {products.map((product) => (
                <ProductCard loading={loading} product={product} />
            ))}
        </div>
    );
};
