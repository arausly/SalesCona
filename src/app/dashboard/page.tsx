"use client";
import React from "react";
import Dropdown from "@components/Menudrown";
import {
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    BuildingStorefrontIcon,
    CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import {
    formatNumberWithSuffix,
    generateAvatarBg,
    generateAvatarInitials,
    truncateString,
} from "@lib/format-utils";
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
        views: "73",
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
        views: "27",
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
        views: "15",
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
        views: "10",
    },
];

const pagination = {
    finalPage: 50,
    totalItemsCount: 500,
    pageItemCount: 10,
};

const reviews = [
    {
        name: "Emmanuel ikechukwu",
        comment: "I will never sleep on your sales, one of the best",
        rating: 4.5,
    },
    {
        name: "Chinedu moses",
        comment: "A good experience all in all",
        rating: 4,
    },
    {
        name: "Babajide simons",
        comment: "I am had to wait 5 days before receiving your product ",
        rating: 2,
    },
    {
        name: "Sarah ajib",
        comment:
            "I really like your shop page, I found exactly what I was looking for and received within 3 days",
        rating: 5,
    },
    {
        name: "Akanbi",
        comment: "I couldn't find the cream advertized on your main page",
        rating: 1,
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
                            title="Products views ranking"
                            headers={headers}
                            rows={rows}
                            pagination={pagination}
                            onSearch={() => {}}
                            onPaginate={() => {}}
                        />
                    </div>
                </div>
                <aside className="h-full shadow-md bg-white mt-6 md:mt-0 ml-0 md:ml-10 w-full md:w-max p-3 rounded-sm flex flex-col overflow-auto">
                    <div className="flex flex-row justify-between items-center border-b border-slate-200 pb-2 mb-2">
                        <p className="text-lg md:text-xl mr-8">Reviews</p>
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center mb-4">
                                <p className="text-base md:text-lg mr-3">
                                    3.9 / 5
                                </p>
                                <Rating rating={3.9} />
                            </div>
                            <p className="font-thin text-slate-600 text-xs">
                                (5 Reviews)
                            </p>
                        </div>
                    </div>
                    {reviews.map((review, i) => (
                        <div
                            key={i}
                            className="flex flex-col p-2 mb-2 border-b border-slate-100 pb-4"
                        >
                            <div className="flex flex-row items-center ">
                                <div
                                    style={{
                                        backgroundColor: generateAvatarBg(),
                                    }}
                                    className="uppercase flex flex-col items-center justify-center w-12 h-12 rounded-full"
                                >
                                    <p className="text-lg text-gray-600">
                                        {generateAvatarInitials(review.name)}{" "}
                                    </p>
                                </div>
                                <div className="flex flex-col ml-3">
                                    <p className="capitalize text-semibold text-base">
                                        {review.name}
                                    </p>
                                    <Rating rating={review.rating} />
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mt-4 font-light">
                                {truncateString(review.comment, 100)}
                            </p>
                        </div>
                    ))}
                </aside>
            </div>
        </div>
    );
}
