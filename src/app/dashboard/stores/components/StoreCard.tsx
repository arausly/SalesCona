"use client";
import { truncateString } from "@lib/format-utils";

//styles
import styles from "../styles/store-card.module.css";
import { StoreCardMenuDropdown } from "./StoreCardMenuDropdown";
import Link from "next/link";
import { generateShopAlias } from "@lib/common.utils";
import { ProductStatus } from "./ProductStatus";

interface StoreCardProps {
    store: any;
    img: any;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, img }) => {
    return (
        <div
            className={`${styles.storeCard} w-full md:w-56 md:mr-6 flex flex-col h-44 mt-8 md:h-72 bg-white rounded-md transition ease-in-out shadow-xl`}
        >
            {/** cover art/thumbnail */}
            <div className="h-20 md:h-44 relative">
                <Link
                    href={`/dashboard/stores/${generateShopAlias(store.name)}`}
                    className="absolute opacity-60 md:opacity-0 top-0 left-0 w-full h-full bg-black transition rounded-tl-md rounded-tr-md ease-in-out cursor-pointer"
                />
                {img}
                <StoreCardMenuDropdown name={store.name} />
            </div>
            <div className="flex flex-col p-3">
                <div className="flex items-center justify-between">
                    <p className="flex-1 whitespace-nowrap font-normal text-base text-ellipsis overflow-hidden">
                        {store.name}
                    </p>
                    <div
                        className={` ${
                            store.status === "draft"
                                ? "bg-gray-200"
                                : "bg-green-200"
                        }  w-fit h-4 flex p-2 justify-center rounded-md items-center`}
                    >
                        <p
                            className={`text-xs ${
                                store.status === "draft"
                                    ? "text-gray-800"
                                    : "text-green-800"
                            } `}
                        >
                            {store.status}
                        </p>
                    </div>
                </div>

                <p className="font-medium text-xs text-ellipsis mt-1">
                    {truncateString(store.description, 60)}
                </p>
            </div>
            <div className="flex items-center overflow-hidden px-3">
                {store.tags?.map((tag: string, i: number) => (
                    <span
                        key={i}
                        className="inline-flex bg-slate-50 border border-slate-200 rounded-full items-center justify-center mr-2 mb-1 h-5 w-20 p-1"
                    >
                        <p className="text-xs text-ellipsis font-light overflow-hidden whitespace-nowrap">
                            {tag}
                        </p>
                    </span>
                ))}
            </div>
        </div>
    );
};
