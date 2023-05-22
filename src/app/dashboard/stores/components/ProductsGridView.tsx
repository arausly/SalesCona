import shirt from "@assets/images/shirts.webp";
import Image from "next/image";
import { Product } from "../typing";
import { ProductStatus } from "./ProductStatus";
import { formatNumberWithSuffix } from "@lib/format-utils";
import { PencilIcon } from "@heroicons/react/24/outline";

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <div className="flex flex-col w-96 mb-8 rounded-md border border-slate-100 shadow-md relative">
            <div className="absolute top-4 right-4 flex justify-center items-center cursor-pointer h-10 w-10 transition ease-in-out bg-white hover:bg-slate-50 shadow-md rounded-full">
                <PencilIcon className="h-5 w-5 text-[#6d67e4]" />
            </div>
            <div className="w-full flex-1">
                <Image src={shirt} className="object-cover" alt="shirt" />
            </div>
            <div className="px-8 py-4">
                <ProductStatus product={product} />
                <p className="mt-2">{product.product}</p>
                <span className="inline-block h-0.5 w-full bg-slate-100" />
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600">Price</p>
                        <p>{product.price}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Inventory</p>
                        <p>{product.inventoryCount}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Views</p>
                        <p>
                            {formatNumberWithSuffix(Number(product.viewCount))}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProductsGridView = ({
    products
}: {
    products: Array<Product>;
}) => {
    return (
        <div className="flex justify-between flex-wrap">
            {products.map((product) => (
                <ProductCard product={product} />
            ))}
        </div>
    );
};
