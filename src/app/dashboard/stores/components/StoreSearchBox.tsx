"use client";
import React from "react";
import { StoreContext } from "./StoreList";
import { SearchField } from "@components/Input/SearchField";
import { Spinner } from "@components/Spinner";

export const StoreSearchBox = () => {
    const { searchStores, storeLoading } = React.useContext(StoreContext);

    return (
        <div className="flex">
            <SearchField
                className="w-full md:w-96 mb-6 shadow-xl mr-4"
                inputClassName="bg-white"
                placeholder="Search stores"
                onChange={(e) => searchStores(e.target.value)}
            />
            {storeLoading && (
                <div className="mt-1.5">
                    <Spinner />
                </div>
            )}
        </div>
    );
};
