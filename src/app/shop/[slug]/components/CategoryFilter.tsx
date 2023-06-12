"use client";
//todo replace categories dummy data with API data
import categories from "@data/categories.json";
import { useGetLastPathname } from "@hooks/useGetLastPathname";
import { useGetShopName } from "@hooks/useGetShopName";
import {
    convertPathToSpaceSeparatedStr,
    spaceSeparatedStrToPath
} from "@lib/format-utils";
import Link from "next/link";

//todo use getStaticParams because categories can only be a certain amount

export const CategoryFilter = () => {
    const shopName = useGetShopName();
    const category = useGetLastPathname();

    return (
        <div className="flex flex-col bg-white py-6 px-12 shadow-sm">
            <p className="uppercase font-normal tracking-wider mb-4">
                Product <br /> Categories
            </p>
            <div className="flex flex-col">
                <Link
                    href={`/shop/${shopName}`}
                    className={`mb-2 text-base hover:text-[#6d67e4] transition ease-in-out ${
                        category === shopName
                            ? "font-semibold text-[#6d67e4]"
                            : "text-black font-light"
                    } `}
                >
                    All
                </Link>
                {categories.entries.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/shop/${shopName}/${spaceSeparatedStrToPath(
                            cat.label
                        )}`}
                        className={`mb-2 text-base hover:text-[#6d67e4] transition ease-in-out ${
                            convertPathToSpaceSeparatedStr(category).fmt ===
                            cat.label.toLowerCase()
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
