import { CheckIcon, PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CreateStore() {
    return (
        <div className="p-6 flex flex-col w-full">
            <div className="flex flex-col pb-6 border-b border-slate-200 w-full">
                <div className="flex items-center">
                    <Link
                        href="/dashboard/stores"
                        className="text-gray-700 text-sm font-medium mr-2"
                    >
                        Stores
                    </Link>
                    <span className="text-gray-400">/</span>
                    <p className="text-gray-400 text-sm font-normal ml-2">
                        New Store
                    </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center">
                        <h3 className="text-lg font-base mr-3">New Store</h3>
                        <span className="inline-block bg-slate-200 text-xs flex text-slate-700 items-center justify-center rounded-full w-10 h-5">
                            Draft
                        </span>
                    </div>
                    <div className="flex items-center">
                        <button className="w-28 h-10 rounded-full bg-white hover:bg-slate-100 transition mr-4 border border-slate-200 shadow-md flex justify-center items-center">
                            <PencilIcon className="h-4 w-4 mr-2 text-gray-700" />
                            <p className="text-gray-700 text-sm">Save draft</p>
                        </button>
                        <button className="w-28 h-10 rounded-full primary-bg shadow-md border transition border-[#6d67e4] hover:bg-indigo-500 flex justify-center items-center">
                            <CheckIcon className="h-5 w-5 text-white mr-2" />
                            <p className="text-white text-sm">Publish</p>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex w-full mt-6">
                <div className="flex-1">
                    <div className="flex flex-col mb-6">
                        <p className="mb-1">Store name</p>
                        <input
                            type="text"
                            id="table-search"
                            placeholder="Store name"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex">
                            <p className="mb-1 mr-1">Store name</p>
                            <span className="text-[#6d67e4]">*</span>
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            placeholder="Store name"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                        />
                    </div>
                </div>
                <div className="flex-1"></div>
            </div>
        </div>
    );
}
