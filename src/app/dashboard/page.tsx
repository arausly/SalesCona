"use client";
import React from "react";
import Dropdown from "@components/Menudrown";
import {
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    BuildingStorefrontIcon,
    CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { formatNumberWithSuffix } from "@lib/format-utils";
import { Table } from "@components/Table/Table";
import Image from "next/image";

//images
import allStars from "@assets/images/allstars.jpeg";
import cream from "@assets/images/cream.jpeg";
import shirt from "@assets/images/shirts.webp";
import bag from "@assets/images/bag.jpeg";
import { Rating } from "@components/Rating";

const dateSelections = [
    { label: "Last 24 hours" },
    { label: "Last one week" },
    { label: "Last one month" },
    { label: "Last 3 months" },
    { label: "Last one year" },
];
const stores = [{ label: "Shiol" }, { label: "Wakaious" }]; //todo replace with real data
const trendingIcons = [
    { icon: ArrowTrendingDownIcon, direction: "down" },
    { icon: ArrowTrendingUpIcon, direction: "up" },
];

const headers = [
    { id: "name", label: "Product name" },
    { id: "price", label: "Price" },
    { id: "category", label: "Category" },
    { id: "description", label: "Description" },
    { id: "views", label: "Views" },
];

const rows = [
    {
        name: (
            <div className="pl-3 flex flex-row items-center object-cover">
                <Image
                    src={cream}
                    alt="face cream"
                    className="w-10 h-10 rounded"
                />
                <p className="text-sm text-gray-600 ml-3">Face cream</p>
            </div>
        ),
        price: Number(4500).toLocaleString(),
        category: "creams",
        views: "10",
        description:
            "All shi-oil creams are top notch and well soothing to the skin",
    },
    {
        name: (
            <div className="pl-3 flex flex-row items-center object-cover">
                <Image
                    src={allStars}
                    alt="All stars"
                    className="w-10 h-10 rounded"
                />
                <p className="text-sm text-gray-600 ml-3">All stars shoe</p>
            </div>
        ),
        price: Number(3500).toLocaleString(),
        category: "sneakers",
        views: "15",
        description: "Affordable male sneaker wears,",
    },
    {
        name: (
            <div className="pl-3 flex flex-row items-center object-cover">
                <Image src={shirt} alt="shirts" className="w-10 h-10 rounded" />
                <div className="text-sm text-gray-600 ml-3">
                    Marks and Spencer
                </div>
            </div>
        ),
        price: Number(1700).toLocaleString(),
        category: "shirts",
        description: "Casual male shirts",
        views: "73",
    },
    {
        name: (
            <div className="pl-3 flex flex-row items-center object-cover">
                <Image src={bag} alt="bag" className="w-10 h-10 rounded" />
                <div className="text-sm text-gray-600 ml-3">Balenciaga</div>
            </div>
        ),
        price: Number(2900).toLocaleString(),
        category: "bag",
        description: "luxury bags available",
        views: "27",
    },
];

export default function Dashboard() {
    const [selectedDuration, setSelectedDuration] = React.useState<string>(
        dateSelections[0].label
    );
    const [selectedStore, setSelectedStore] = React.useState<string>(
        stores[0].label
    );

    const getTrendingIcon = React.useMemo(
        () => trendingIcons[Math.floor(Math.random() * 2)],
        []
    ); //todo remove with real data

    return (
        <div className="flex flex-col">
            {/** filters  */}
            <div className="flex flex-col md:flex-row">
                <div className="mb-3 md:mr-3">
                    <Dropdown
                        titleIcon={
                            <CalendarDaysIcon
                                className="ml-2 -mr-1 h-5 w-5 text-black mr-2"
                                aria-hidden="true"
                            />
                        }
                        items={dateSelections}
                        onSelectItem={(label) => setSelectedDuration(label)}
                    />
                </div>
                <div>
                    <Dropdown
                        titleIcon={
                            <BuildingStorefrontIcon
                                className="ml-2 -mr-1 h-5 w-5 text-black mr-2"
                                aria-hidden="true"
                            />
                        }
                        items={stores}
                        onSelectItem={(label) => setSelectedStore(label)}
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="flex-1">
                    {/** stats Cards */}
                    <div className="mt-11 flex flex-col md:flex-row w-full md:w-max">
                        <div className="bg-white flex flex-col mr-0 mb-11 md:mb-0 md:mr-11 rounded-md bg-white shadow-lg p-4">
                            <p className="font-light text-sm mb-3 text-gray-600">
                                Visitors
                            </p>
                            <p className="text-3xl mb-1">
                                {formatNumberWithSuffix(7432)}
                            </p>
                            <div className="flex flex-row items-center">
                                <p>
                                    <getTrendingIcon.icon
                                        className={`${
                                            getTrendingIcon.direction === "down"
                                                ? "text-red-400"
                                                : "text-green-600"
                                        } h-4 w-4 mr-1`}
                                    />
                                </p>
                                <p
                                    className={`${
                                        getTrendingIcon.direction === "down"
                                            ? "text-red-400"
                                            : "text-green-600"
                                    } text-sm mr-1`}
                                >
                                    13%
                                </p>
                                <p className="lowercase text-sm text-gray-400 font-light mr-1">
                                    in the {selectedDuration} for
                                </p>
                                <p className="font-medium text-sm">
                                    {selectedStore}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white flex flex-col rounded-md bg-white shadow-lg p-4">
                            <p className="font-light text-sm mb-3 text-gray-600">
                                Followers
                            </p>
                            <p className="text-3xl mb-1">
                                {formatNumberWithSuffix(129)}
                            </p>
                            <div className="flex flex-row items-center">
                                <p>
                                    <getTrendingIcon.icon
                                        className={`${
                                            getTrendingIcon.direction === "down"
                                                ? "text-red-400"
                                                : "text-green-600"
                                        } h-4 w-4 mr-1`}
                                    />
                                </p>
                                <p
                                    className={`${
                                        getTrendingIcon.direction === "down"
                                            ? "text-red-400"
                                            : "text-green-600"
                                    } text-sm mr-1`}
                                >
                                    13%
                                </p>
                                <p className="lowercase text-sm text-gray-400 font-light mr-1">
                                    in the {selectedDuration} for
                                </p>
                                <p className="font-medium text-sm">
                                    {selectedStore}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/** Top Viewed products */}
                    <div className="mt-11">
                        <Table
                            title="Top viewed products"
                            headers={headers}
                            rows={rows}
                        />
                    </div>
                </div>
                <aside className="h-full shadow-md bg-white w-max p-3 flex flex-col">
                    <div className="flex flex-row items-center border-b border-slate-200">
                        <p className="text-lg md:text-xl">Reviews</p>
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <p className="text-base mr-3">4.9</p>
                                <Rating rating={1} />
                            </div>
                            <p className="font-light text-sm">(43 Reviews)</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
