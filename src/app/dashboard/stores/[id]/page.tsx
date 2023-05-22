"use client";
import React, { Fragment } from "react";
import { Breadcrumb } from "@components/Breadcrumb";
import {
    CubeIcon,
    DocumentArrowDownIcon,
    DocumentArrowUpIcon,
    ListBulletIcon,
    PencilIcon,
    PlusIcon,
    Squares2X2Icon
} from "@heroicons/react/24/outline";
import { convertPathToSpaceSeparatedStr } from "@lib/format-utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductSearch } from "../components/ProductSearch";
import { Tab, Transition } from "@headlessui/react";

//dummy data
import products from "@data/products.json";
import { ProductsTableView } from "../components/ProductsTableView";
import { Product } from "../typing";
import { ProductsGridView } from "../components/ProductsGridView";

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

enum PRESENTATION_MODES {
    LIST_VIEW = "LIST_VIEW",
    GRID_VIEW = "GRID_VIEW"
}

export default function Store() {
    const pathname = usePathname();
    const { fmt, lastPath } = convertPathToSpaceSeparatedStr(pathname);
    const [presentationMode, setPresentationMode] =
        React.useState<PRESENTATION_MODES>(PRESENTATION_MODES.LIST_VIEW);

    const crumbs = React.useRef([
        {
            name: "Stores",
            link: "/dashboard/stores"
        },
        {
            name: fmt
        }
    ]).current;

    const productsView = (
        <>
            <Transition
                leave="transition ease-in duration-100"
                leaveFrom="translate-x-[0%]"
                leaveTo="translate-x-[100%]"
                show={presentationMode === PRESENTATION_MODES.LIST_VIEW}
            >
                <ProductsTableView products={products.products as Product[]} />
            </Transition>
            <Transition
                leave="transition ease-in duration-100"
                leaveFrom="translate-x-[100%]"
                leaveTo="translate-x-[0%]"
                show={presentationMode === PRESENTATION_MODES.GRID_VIEW}
            >
                <ProductsGridView products={products.products as Product[]} />
            </Transition>
        </>
    );

    return (
        <section className="p-6 flex flex-col w-full h-full dashboard-screen-height overflow-auto">
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
            {/** tab */}
            <div className="mt-8">
                <Tab.Group>
                    <Tab.List>
                        <div className="flex flex-col md:flex-row items-center md:items-start">
                            <div className="flex">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${
                                                selected
                                                    ? "bg-gray-100 text-black"
                                                    : "bg-transparent text-gray-600"
                                            } mr-6 flex items-center justify-center focus:outline-none focus:ring-0 cursor-pointer h-10 w-auto rounded-md px-3 py-0.5`}
                                        >
                                            All
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${
                                                selected
                                                    ? "bg-gray-100 text-black"
                                                    : "bg-transparent text-gray-600"
                                            } mr-6 flex items-center transition ease-in-out justify-center cursor-pointer h-10 w-auto focus:outline-none focus:ring-0 rounded-md px-3 py-0.5`}
                                        >
                                            Published
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${
                                                selected
                                                    ? "bg-gray-100 text-black"
                                                    : "bg-transparent text-gray-600"
                                            } flex items-center justify-center transition ease-in-out cursor-pointer h-10 w-auto focus:outline-none focus:ring-0 rounded-md px-3 py-0.5`}
                                        >
                                            Draft
                                        </button>
                                    )}
                                </Tab>
                            </div>

                            <div className="md:ml-auto mt-4 md:mt-0 flex items-center">
                                <button
                                    onClick={() =>
                                        setPresentationMode(
                                            PRESENTATION_MODES.LIST_VIEW
                                        )
                                    }
                                    className={`${
                                        presentationMode ===
                                        PRESENTATION_MODES.LIST_VIEW
                                            ? "bg-gray-100 text-black"
                                            : "bg-transparent text-gray-600"
                                    } px-3 h-10 py-0.5 mr-4 rounded-md transition ease-in-out`}
                                >
                                    <ListBulletIcon className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={() =>
                                        setPresentationMode(
                                            PRESENTATION_MODES.GRID_VIEW
                                        )
                                    }
                                    className={`${
                                        presentationMode ===
                                        PRESENTATION_MODES.GRID_VIEW
                                            ? "bg-gray-100 text-black"
                                            : "bg-transparent text-gray-600"
                                    } px-3 h-10 py-0.5 rounded-md transition ease-in-out`}
                                >
                                    <Squares2X2Icon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </Tab.List>
                    <Tab.Panels className="mt-6">
                        <Tab.Panel>{productsView}</Tab.Panel>
                        <Tab.Panel>{productsView}</Tab.Panel>
                        <Tab.Panel>{productsView}</Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </section>
    );
}
