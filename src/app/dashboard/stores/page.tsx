"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { StoreList, StoreProvider } from "./components/StoreList";
import { StoreSearchBox } from "./components/StoreSearchBox";

export default function Stores() {
    return (
        <StoreProvider>
            <div className="flex flex-col p-6">
                <StoreSearchBox />
                <p className="text-lg md:text-2xl font-normal">Recent Stores</p>
                <div className="flex flex-wrap">
                    {/** add new  store */}
                    <Link
                        href="/dashboard/stores/create"
                        className="relative flex-col cursor-pointer w-full h-44 md:w-56 md:h-72 rounded-md mt-8 md:mr-6 transition ease-in-out primary-bg hover:shadow-lg md:hover:scale-105 md:px-6"
                    >
                        <PlusIcon className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-8 h-8 text-white" />
                        <p className="absolute text-sm font-light text-white bottom-2 md:bottom-6 left-1/2 translate-x-[-50%]">
                            New store
                        </p>
                    </Link>
                    <StoreList />
                </div>
            </div>
        </StoreProvider>
    );
}
