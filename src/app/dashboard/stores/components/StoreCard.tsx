"use client";
import { truncateString } from "@lib/format-utils";

//styles
import styles from "../styles/store-card.module.css";
import { StoreCardMenuDropdown } from "./StoreCardMenuDropdown";

interface StoreCardProps {
    store: any;
    img: any;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, img }) => {
    return (
        <div
            className={`${styles.storeCard} w-full md:w-56 md:mx-6 flex flex-col h-36 mt-8 md:h-64 bg-white rounded-md transition ease-in-out shadow-xl`}
        >
            {/** cover art/thumbnail */}
            <div className="h-20 md:h-44 relative">
                <div className="absolute opacity-60 md:opacity-0 top-0 left-0 w-full h-full bg-black transition rounded-tl-md rounded-tr-md ease-in-out cursor-pointer" />
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
        </div>
    );
};
