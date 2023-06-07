"use client";
import { Table } from "@components/Table/Table";
import { Product } from "../typing";

//temp images
import shirt from "@assets/images/shirts.webp";
import shoe from "@assets/images/allstars.jpeg";
import Image from "next/image";
import { formatNumberWithSuffix, truncateString } from "@lib/format-utils";
import { ProductStatus } from "./ProductStatus";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProductsTableViewProps {
    products: Array<Product>;
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
    { id: "inventoryCount", label: "Inventory" },
    { id: "viewCount", label: "Views" },
    { id: "action", label: "Actions" }
];

export const ProductsTableView: React.FC<ProductsTableViewProps> = ({
    products
}) => {
    const pathname = usePathname();

    const rows = products.map((product) => ({
        ...product,
        price: <p>${product.price}</p>,
        status: <ProductStatus status={product.status} />,
        viewCount: (
            <p className="text-gray-600">
                {formatNumberWithSuffix(Number(product.viewCount))}
            </p>
        ),
        action: (
            <Link
                href={`/dashboard/stores/${
                    pathname.split("/").slice(-1)[0]
                }/products/${product.product.split(" ").join("-")}`}
                className="flex items-center cursor-pointer"
            >
                <PencilSquareIcon className="h-5 w-5 mr-2 text-[#6d67e4]" />
                <p className="text-[#6d67e4] text-sm">Edit</p>
            </Link>
        ),
        product: (
            <div className="flex items-center">
                <div className="w-14 h-14 mr-3">
                    <Image src={shirt} alt="shirt" className="object-cover" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm mb-2">{product.product}</p>
                    <p className="text-sm font-light">
                        {truncateString(product.description, 40)}
                    </p>
                </div>
            </div>
        )
    }));

    return (
        <Table
            rows={rows}
            headers={headers}
            title=""
            pagination={pagination}
            onPaginate={() => {}}
        />
    );
};
