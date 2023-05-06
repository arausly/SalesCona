"use client";
import React from "react";
import Image from "next/image";
import Dropdown from "@components/Menudrown";
import { Table } from "@components/Table/Table";
import {
    BuildingStorefrontIcon,
    EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
    formatNumberWithSuffix,
    generateAvatarBg,
    generateAvatarInitials,
} from "@lib/format-utils";

//image
import blurredImage from "@assets/images/blurred-image.png";
import { Modal } from "@components/Dialog/Dialog";

/**
 * if paid user, you can see the email and phone number of your subscribers
 *
 */
const rows = [
    {
        name: (
            <div className="flex flex-row items-center ">
                <div
                    style={{
                        backgroundColor: generateAvatarBg(),
                    }}
                    className="uppercase flex flex-col items-center justify-center w-12 h-12 rounded-full"
                >
                    <p className="text-lg text-gray-600">
                        {generateAvatarInitials("Emmanuel Bolanle")}{" "}
                    </p>
                </div>
                <p className="ml-4 truncate">Emmanuel Bolanle</p>
            </div>
        ),
        product: "Face cream",
        email: "test1@yahoo.com",
        phone: "+23484345736",
        date: "20-02-2023",
    },
    {
        name: (
            <div className="flex flex-row items-center ">
                <div
                    style={{
                        backgroundColor: generateAvatarBg(),
                    }}
                    className="uppercase flex flex-col items-center justify-center w-12 h-12 rounded-full"
                >
                    <p className="text-lg text-gray-600">
                        {generateAvatarInitials("Emmanuel Bolanle")}{" "}
                    </p>
                </div>
                <p className="ml-4 truncate">Emmanuel Bolanle</p>
            </div>
        ),
        product: "Face cream",
        email: <Image src={blurredImage} alt="blurred" className="h-5" />,
        phone: "Nil",
        date: "20-02-2023",
    },
    {
        name: (
            <div className="flex flex-row items-center ">
                <div
                    style={{
                        backgroundColor: generateAvatarBg(),
                    }}
                    className="uppercase flex flex-col items-center justify-center w-12 h-12 rounded-full"
                >
                    <p className="text-lg text-gray-600">
                        {generateAvatarInitials("Emmanuel Bolanle")}{" "}
                    </p>
                </div>
                <p className="ml-4 truncate">Emmanuel Bolanle</p>
            </div>
        ),
        product: "Face cream",
        email: "test1@yahoo.com",
        phone: "+23484345736",
        date: "20-02-2023",
    },
    {
        name: (
            <div className="flex flex-row items-center ">
                <div
                    style={{
                        backgroundColor: generateAvatarBg(),
                    }}
                    className="uppercase flex flex-col items-center justify-center w-12 h-12 rounded-full"
                >
                    <p className="text-lg text-gray-600">
                        {generateAvatarInitials("Emmanuel Bolanle")}{" "}
                    </p>
                </div>
                <p className="ml-4 truncate">Emmanuel Bolanle</p>
            </div>
        ),
        product: "Face cream",
        email: "test1@yahoo.com",
        phone: "+23484345736",
        date: "20-02-2023",
    },
    {
        name: (
            <div className="flex flex-row items-center ">
                <div
                    style={{
                        backgroundColor: generateAvatarBg(),
                    }}
                    className="uppercase flex flex-col items-center justify-center w-12 h-12 rounded-full"
                >
                    <p className="text-lg text-gray-600">
                        {generateAvatarInitials("Emmanuel Bolanle")}{" "}
                    </p>
                </div>
                <p className="ml-4 truncate">Emmanuel Bolanle</p>
            </div>
        ),
        product: "Face cream",
        email: "test1@yahoo.com",
        phone: "+23484345736",
        date: "20-02-2023",
    },
];

const pagination = {
    finalPage: 50,
    totalItemsCount: 500,
    pageItemCount: 10,
};

const stores = [{ label: "Shiol" }, { label: "Wakaious" }]; //todo replace with real data

export default function Followers() {
    const [selectedStore, setSelectedStore] = React.useState<string>(
        stores[0].label
    );
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    console.log({ isModalOpen });

    const headers = [
        { id: "name", label: "Name" },
        { id: "product", label: "Product Name" },
        {
            id: "email",
            label: (
                <div className="flex flex-row items-center">
                    <p className="mr-2">Email</p>
                    <EyeSlashIcon
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>
            ),
        },
        { id: "phone", label: "Phone" },
        { id: "date", label: "Date" },
    ];

    const toggleViewContactModal = React.useCallback(() => {
        setIsModalOpen((open) => !open);
    }, []);

    return (
        <div className="flex flex-col">
            <Modal
                title="Customer contact information"
                isOpen={isModalOpen}
                toggleModal={toggleViewContactModal}
            >
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        Viewing customer information is reserved for our payment
                        plan, please contact us via mail
                        <a
                            className="text-sm no-underline ml-1 text-blue-500"
                            href="mailto:friendiesupport@gmail.com"
                        >
                            friendiesupport@gmail.com
                        </a>
                    </p>
                </div>
                <div className="mt-4">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={toggleViewContactModal}
                    >
                        Got it, thanks!
                    </button>
                </div>
            </Modal>
            <div className="mb-5 z-10">
                <Dropdown
                    titleIcon={
                        <BuildingStorefrontIcon
                            className="ml-2 -mr-1 h-5 w-5 text-black mr-2"
                            aria-hidden="true"
                        />
                    }
                    items={stores}
                    onSelectItem={(label) => setSelectedStore(label)}
                />
            </div>
            <Table
                title={
                    <div className="flex flex-row items-center mb-2 md:mb-0">
                        <p className="text-base font-semibold">Followers</p>
                        <sup className="text-sm ml-1">
                            {formatNumberWithSuffix(rows.length)}
                        </sup>
                    </div>
                }
                headers={headers}
                rows={rows}
                pagination={pagination}
                onSearch={() => {}}
                onPaginate={() => {}}
            />
        </div>
    );
}
