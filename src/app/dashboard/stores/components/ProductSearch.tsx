"use client";
import React, { Fragment, ReactNode } from "react";
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    FunnelIcon
} from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import Dropdown from "@components/Menudropdown";

//images
import shirt from "@assets/images/shirts.webp";
import shoe from "@assets/images/allstars.jpeg";
import Image from "next/image";
import { formatTimeAgo } from "@lib/format-utils";

//Todo add correct type to lastSeen and draft
interface ProductSearchProps {
    categories: {
        label: string;
        icon: React.FC<any>;
    }[];
    lastSeen: {
        published: {
            name: string;
            time: string;
        }[];
        draft: {
            name: string;
            time: string;
        }[];
    };
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
    categories,
    lastSeen
}) => {
    const [showFilter, setShowFilter] = React.useState<boolean>(false);
    const [selectedFilterCategories, setSelectedFilterCategories] =
        React.useState<Map<string, boolean>>(new Map());
    const searchBoxRef = React.useRef(null);
    const [shownCategoriesCap, setShowCategoriesCap] = React.useState<number>(
        categories.length
    );

    React.useEffect(() => {
        if (!searchBoxRef.current) return;
        const searchBox = searchBoxRef.current as any;
        const handleClickOutside = (event: any) => {
            if (!searchBox?.contains(event.target)) {
                setShowFilter(false);
            }
        };

        //each is 112px + 12px horizontal padding making
        //each box 124px. the actual width is the div with excluding the div padding
        const maxBoxes = Math.floor((searchBox.offsetWidth - 24) / 124);
        setShowCategoriesCap(() =>
            categories.length > maxBoxes ? maxBoxes - 1 : maxBoxes
        );

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [searchBoxRef.current]);

    const clearFilters = React.useCallback(() => {
        setSelectedFilterCategories(new Map());
    }, []);

    const handleFilterSelection = React.useCallback((category: string) => {
        setSelectedFilterCategories((prev) => {
            if (prev.has(category)) {
                prev.delete(category);
                return new Map([...prev]);
            } else {
                return new Map([...prev, [category, true]]);
            }
        });
    }, []);

    const toggleFilter = React.useCallback(() => setShowFilter((s) => !s), []);

    return (
        <div
            ref={searchBoxRef}
            className="flex flex-col items-center w-full md:w-3/6 relative"
        >
            <div className="relative w-full shadow-md rounded-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                </div>
                <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={toggleFilter}
                >
                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
                </button>
                <input
                    onMouseDown={toggleFilter}
                    placeholder="Start searching..."
                    className="w-full h-14 p-2 pl-10 text-sm text-black bg-white border shadow-[#6d67e4] focus:outline-none rounded-md"
                />
            </div>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                show={showFilter}
            >
                <div className="bg-white w-full shadow-md rounded-md p-3 absolute top-16 z-10">
                    <div className="my-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <FunnelIcon className="h-5 w-5 mr-1 text-slate-600" />
                            <p className="text-slate-600">Filter</p>
                        </div>
                        {selectedFilterCategories.size ? (
                            <button
                                type="button"
                                className="inline-flex primary-bg items-center px-2 h-8 rounded-md text-white"
                                onClick={clearFilters}
                            >
                                Clear {selectedFilterCategories.size} filters{" "}
                            </button>
                        ) : null}
                    </div>
                    <div className="flex items-center">
                        {/** categories */}
                        {categories
                            .slice(0, shownCategoriesCap)
                            .map((category) => (
                                <div
                                    onClick={() =>
                                        handleFilterSelection(category.label)
                                    }
                                    key={category.label}
                                    className={`${
                                        selectedFilterCategories.has(
                                            category.label
                                        )
                                            ? "bg-[#ECF2FF]"
                                            : "bg-white"
                                    } w-28 flex-1 shadow-sm hover:bg-slate-50 transition ease-in-out border border-slate-200 cursor-pointer flex justify-center items-center rounded-md mr-3`}
                                >
                                    <category.icon
                                        className={` ${
                                            selectedFilterCategories.has(
                                                category.label
                                            )
                                                ? "text-[#6d67e4]"
                                                : "text-slate-600"
                                        } h-5 w-5 mr-1`}
                                    />
                                    <p
                                        className={`${
                                            selectedFilterCategories.has(
                                                category.label
                                            )
                                                ? "text-[#6d67e4]"
                                                : "text-slate-600"
                                        } font-medium text-sm px-2 py-1.5 capitalize`}
                                    >
                                        {category.label}
                                    </p>
                                </div>
                            ))}
                        {categories.length > shownCategoriesCap && (
                            <Dropdown<any>
                                items={categories
                                    .slice(shownCategoriesCap)
                                    .map(({ label }) => ({ label }))}
                                title={
                                    !shownCategoriesCap
                                        ? "Choose options"
                                        : "More"
                                }
                                onSelectItem={handleFilterSelection}
                                wrapperClasses="md:!w-28 flex-1"
                                menuItemsClasses="md:!w-28"
                                menuClassNames="rounded-md shadow-sm"
                                highlightButtonOnClick
                            />
                        )}
                    </div>

                    {/** published products */}
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        show={
                            !selectedFilterCategories.has("Draft") ||
                            selectedFilterCategories.has("Published")
                        }
                    >
                        <div className="mt-4 border-b border-gray-200 pb-3">
                            <p className="text-sm font-medium text-slate-600">
                                Published
                            </p>
                            <div className="flex flex-col">
                                {lastSeen.published.map((pub, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center mt-4 w-full cursor-pointer hover:bg-gray-50 py-1"
                                    >
                                        <div className="relative w-14 h-14 rounded-full border-2 border-slate-100 shadow-sm mr-2">
                                            <span className="absolute top-0 left-0 w-full h-full rounded-full bg-black opacity-20" />
                                            <Image
                                                src={shirt}
                                                alt="Shirt"
                                                className="object-cover rounded-full"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-slate-600">
                                            {pub.name}
                                        </p>
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-200 mx-2" />
                                        <p className="text-sm font-medium text-gray-500">
                                            {formatTimeAgo(
                                                new Date(pub.time).getTime()
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Transition>

                    {/** draft */}
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        show={
                            !selectedFilterCategories.has("Published") ||
                            selectedFilterCategories.has("Draft")
                        }
                    >
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-600">
                                Drafts
                            </p>
                            <div className="flex flex-col">
                                {lastSeen.draft.map((pub) => (
                                    <div
                                        key={pub.name}
                                        className="flex items-center mt-4 w-full cursor-pointer hover:bg-gray-50 py-1"
                                    >
                                        <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-slate-100 shadow-sm mr-2">
                                            <span className="absolute object-cover top-0 left-0 w-full h-full rounded-full bg-black opacity-20" />
                                            <Image
                                                src={shoe}
                                                alt="cream"
                                                height={56}
                                                width={56}
                                                className="object-cover rounded-full"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-slate-600">
                                            {pub.name}
                                        </p>
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-200 mx-2" />
                                        <p className="text-sm font-medium text-gray-500">
                                            {formatTimeAgo(
                                                new Date(pub.time).getTime()
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </div>
    );
};
