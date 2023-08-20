"use client";
import React from "react";
import { truncateString } from "@lib/format-utils";

//styles
import styles from "../styles/store-card.module.css";
import { StoreCardMenuDropdown } from "./StoreCardMenuDropdown";
import Link from "next/link";
import { generateShopAlias } from "@lib/common.utils";
import { Store } from "../typing";

interface StoreCardProps {
    store: Store;
    img: any;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, img }) => {
    const [storeCategories, setStoreCategories] = React.useState<
        Store["categories"]
    >([]);
    const tagBoxRef = React.useRef(null);

    React.useEffect(() => {
        if (store?.categories?.length) {
            const tagBox = tagBoxRef.current as any;

            //padding + space plus circle delimiter
            const maxBoxes = Math.floor((tagBox.offsetWidth - 44) / 80);

            setStoreCategories(() =>
                store?.categories?.slice(
                    0,
                    Math.min(store?.categories?.length, maxBoxes)
                )
            );
        }
    }, [store]);

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
                <StoreCardMenuDropdown store={store} />
            </div>
            <div className="flex flex-col p-3">
                <div className="flex items-center justify-between">
                    <p className="flex-1 whitespace-nowrap font-normal text-base text-ellipsis overflow-hidden">
                        {store.name}
                    </p>
                    <div
                        className={` ${
                            !store.isPublished ? "bg-gray-200" : "bg-green-200"
                        }  w-fit h-4 flex p-2 justify-center rounded-md items-center`}
                    >
                        <p
                            className={`text-xs ${
                                !store.isPublished
                                    ? "text-gray-800"
                                    : "text-green-800"
                            } `}
                        >
                            {store.isPublished ? "Published" : "Draft"}
                        </p>
                    </div>
                </div>

                <p className="font-medium text-xs whitespace-nowrap overflow-hidden text-ellipsis mt-1">
                    {truncateString(store.description, 60)}
                </p>
            </div>
            {store?.categories?.length ? (
                <div
                    ref={tagBoxRef}
                    className="flex items-center overflow-hidden px-3"
                >
                    {storeCategories?.map((storeCategory, i) => (
                        <span
                            key={storeCategory.category.id}
                            className="inline-flex bg-slate-50 border border-slate-200 rounded-full items-center justify-center mr-2 mb-1 h-5 w-20 p-1"
                        >
                            <p className="text-xs text-ellipsis font-light overflow-hidden whitespace-nowrap">
                                {storeCategory.category.label}
                            </p>
                        </span>
                    ))}
                    {store?.categories?.length >
                    (storeCategories?.length ?? 0) ? (
                        <span className="inline-flex items-center justify-center bg-slate-50 rounded-full h-5 w-5 px-3 border border-slate-200 mb-1">
                            <p className="text-xs font-light">
                                {store?.categories?.length -
                                    (storeCategories?.length ?? 0)}
                                +
                            </p>
                        </span>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};
