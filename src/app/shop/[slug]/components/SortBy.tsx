"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const sortByFilters = [
    { label: "Trending", id: "trending" },
    { label: "Latest", id: "latest" },
    { label: "Price: Low to high", id: "price-asc" },
    { label: "Price: High to low", id: "price-desc" }
] as const;

export const SortBy = () => {
    const searchParams = useSearchParams()!;
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (sortByParams: (typeof sortByFilters)[number]["id"]) =>
        searchParams.get("sort") === sortByParams;

    const createQueryString = React.useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams as any);
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    return (
        <div className="flex flex-col bg-white py-6 px-12">
            <p className="uppercase font-normal tracking-wider mb-4">Sort by</p>
            <div className="flex flex-col">
                {/**by view count */}
                {sortByFilters.map((filter) => (
                    <p
                        key={filter.id}
                        onClick={() =>
                            router.push(
                                pathname +
                                    "?" +
                                    createQueryString("sort", filter.id)
                            )
                        }
                        className={`cursor-pointer transition ease-in-out hover:text-[#6d67e4] mb-2 ${
                            isActive(filter.id)
                                ? "text-[#6d67e4] font-bold"
                                : "text-black font-light "
                        }`}
                    >
                        {filter.label}
                    </p>
                ))}
            </div>
        </div>
    );
};
