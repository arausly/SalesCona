"use client";
//todo replace categories dummy data with API data
import categories from "@data/categories.json";
import { useGetLastPathname } from "@hooks/useGetLastPathname";
import { useGetShopName } from "@hooks/useGetShopName";
import { spaceSeparatedStrToPath } from "@lib/format-utils";
import Link from "next/link";

export const CategoryFilter = () => {
    const shopName = useGetShopName();
    const category = useGetLastPathname();

    return (
        <div className="flex flex-col bg-white py-6 px-12">
            <p className="uppercase font-normal tracking-wider mb-4">
                Product <br /> Categories
            </p>
            <div className="flex flex-col">
                {categories.entries.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/shop/${shopName}/${spaceSeparatedStrToPath(
                            cat.label
                        )}`}
                        className={`mb-2 text-base hover:text-[#6d67e4] transition ease-in-out ${
                            category === cat.label
                                ? "font-semibold text-[#6d67e4]"
                                : "text-black font-light"
                        }`}
                    >
                        {cat.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};
