"use client";
import React from "react";
import { Breadcrumb } from "@components/Breadcrumb";
import {
    CubeIcon,
    DocumentArrowDownIcon,
    DocumentArrowUpIcon,
    PencilIcon,
    PlusIcon
} from "@heroicons/react/24/outline";
import { convertPathToSpaceSeparatedStr } from "@lib/format-utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductSearch } from "../components/ProductSearch";

//todo add correct from API categories
const categories = [
    {
        label: "Published",
        icon: DocumentArrowUpIcon
    },
    {
        label: "Draft",
        icon: DocumentArrowDownIcon
    },
    {
        label: "Phones",
        icon: CubeIcon
    },
    {
        label: "Shoes",
        icon: CubeIcon
    },
    {
        label: "Electronics",
        icon: CubeIcon
    },
    {
        label: "Clothing",
        icon: CubeIcon
    },
    {
        label: "Home Appliances",
        icon: CubeIcon
    },
    {
        label: "Books",
        icon: CubeIcon
    },
    {
        label: "Sports Equipment",
        icon: CubeIcon
    },
    {
        label: "Beauty Products",
        icon: CubeIcon
    }
];

const lastSeen = {
    published: [
        { name: "Product A", time: "2023-05-16T10:30:00Z" },
        { name: "Product B", time: "2023-05-17T14:45:00Z" },
        { name: "Product C", time: "2023-05-18T09:15:00Z" }
    ],
    draft: [
        { name: "Product D", time: "2023-05-19T12:00:00Z" },
        { name: "Product E", time: "2023-05-20T08:20:00Z" }
    ]
};

export default function Store() {
    const pathname = usePathname();
    const { fmt, lastPath } = convertPathToSpaceSeparatedStr(pathname);

    const crumbs = React.useRef([
        {
            name: "Stores",
            link: "/dashboard/stores"
        },
        {
            name: fmt
        }
    ]).current;

    return (
        <section className="p-6 flex flex-col w-full h-full">
            <div className="flex flex-col pb-6 border-b border-slate-200 w-full">
                <Breadcrumb crumbs={crumbs} />
                <div className="flex flex-col md:flex-row items-center justify-between mt-6">
                    <h3 className="text-xl font-base mr-3 capitalize">{fmt}</h3>
                    <div className="flex items-center mt-4 md:mt-0">
                        <Link
                            href={`/dashboard/stores/${lastPath}/edit`}
                            className="w-32 h-10 rounded-full bg-white hover:bg-slate-100 transition border border-slate-200 shadow-md flex justify-center items-center"
                        >
                            <PencilIcon className="h-4 w-4 mr-2 text-gray-700" />
                            <p className="text-gray-700 text-sm">Edit Store</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex justify-between my-6">
                <p className="text-xl mr-3 capitalize">Products</p>
                <button className="w-32 h-10 rounded-full primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center">
                    <PlusIcon className="h-4 w-4 text-white mr-2" />
                    <p className="text-white text-sm">New Product</p>
                </button>
            </div>
            <div className="w-full flex justify-center">
                <ProductSearch categories={categories} lastSeen={lastSeen} />
            </div>
        </section>
    );
}
