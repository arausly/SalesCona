"use client";
import { truncateString } from "@lib/format-utils";

//styles
import styles from "../styles/store-card.module.css";
import { StoreCardMenuDropdown } from "./StoreCardMenuDropdown";
import Link from "next/link";
import { generateShopUrl } from "@lib/common.utils";

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
                    href={`/dashboard/stores/${generateShopUrl(store.name)}`}
                    className="absolute opacity-60 md:opacity-0 top-0 left-0 w-full h-full bg-black transition rounded-tl-md rounded-tr-md ease-in-out cursor-pointer"
                />
                {img}
                <StoreCardMenuDropdown />
            </div>
            <div className="flex flex-col p-3">
                <p className="font-normal text-base text-ellipsis">
                    {store.name}
                </p>
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
