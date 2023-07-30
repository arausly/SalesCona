"use client";
import React from "react";
import { StoreContext } from "./StoreList";
import { SearchField } from "@components/Input/SearchField";

export const StoreSearchBox = () => {
    const { searchStores } = React.useContext(StoreContext);

    return (
        <SearchField
            className="w-full md:w-96 mb-6 shadow-xl"
            inputClassName="bg-white"
            placeholder="Search stores"
            onChange={(e) => searchStores(e.target.value)}
        />
    );
};
