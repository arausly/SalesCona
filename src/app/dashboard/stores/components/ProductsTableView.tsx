"use client";
import { Table } from "@components/Table/Table";
import { Product } from "../typing";

//temp images
import shirt from "@assets/images/shirts.webp";
import shoe from "@assets/images/allstars.jpeg";
import Image from "next/image";
import { formatNumberWithSuffix, truncateString } from "@lib/format-utils";
import { ProductStatus } from "./ProductStatus";
import {
    PencilSquareIcon,
    ShoppingCartIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { excludeKeysFromObj } from "@lib/common.utils";

interface ProductsTableViewProps {
    products: Array<Product>;
    loading: boolean;
    storeSlug: string;
}

const pagination = {
    finalPage: 50,
    totalItemsCount: 500,
    pageItemCount: 10
};

const headers = [
    { id: "product", label: "Product" },
    { id: "status", label: "Status" },
    { id: "price", label: "Price" },
    { id: "inventory_count", label: "Inventory" },
    { id: "viewCount", label: "Views" },
    { id: "action", label: "Actions" }
];

export const ProductsTableView: React.FC<ProductsTableViewProps> = ({
    products,
    loading,
    storeSlug
}) => {
    const pathname = usePathname();

    const rows = products.map((product) => ({
        ...excludeKeysFromObj(product, [
            "store",
            "has_warranty",
            "isPublished"
        ]),
        price: <p>${product.pricing}</p>,
        status: (
            <ProductStatus
                status={product.isPublished ? "published" : "draft"}
            />
        ),
        viewCount: (
            <p className="text-gray-600">
                {formatNumberWithSuffix(product.views_count || 0)}
            </p>
        ),
        action: (
            <Link
                href={`/dashboard/stores/${
                    pathname.split("/").slice(-1)[0]
                }/products/${product.slug}`}
                className="flex items-center cursor-pointer"
            >
                <PencilSquareIcon className="h-5 w-5 mr-2 text-[#6d67e4]" />
                <p className="text-[#6d67e4] text-sm">Edit</p>
            </Link>
        ),
        product: (
            <div className="flex items-center">
                <div className="w-16 h-16 mr-3">
                    <Image
                        src={
                            JSON.parse(product.product_images ?? "[]")[0] ??
                            shirt
                        }
                        alt="shirt"
                        width={64}
                        height={64}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm mb-2">{product.name}</p>
                    <p className="text-sm font-light">
                        {truncateString(product.description, 40)}
                    </p>
                </div>
            </div>
        )
    }));

    return (
        <Table
            loading={loading}
            rows={rows}
            headers={headers}
            title=""
            pagination={pagination}
            onPaginate={() => {}}
            noDataAltAction={
                !products.length ? (
                    <Link
                        href={`/dashboard/stores/${storeSlug}/products/new`}
                        className="w-48 h-10 mt-4 rounded-full primary-bg shadow-md border transition hover:bg-[#393053] flex justify-center items-center"
                    >
                        <ShoppingCartIcon className="h-5 w-5 text-white mr-2" />
                        <p className="text-white text-sm">Create new product</p>
                    </Link>
                ) : null
            }
        />
    );
};
