"use client";
import React from "react";
import Image from "next/image";
import logo from "@assets/images/grok-png.png";
import { BellIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@components/Tooltip";
import Link from "next/link";
import { CustomerAlertForm } from "./CustomerAlertForm";
import { ChatSidePane } from "./ChatSidePane";
import { useGetShopName } from "@hooks/useGetShopName";

export const Navbar = () => {
    const shopName = useGetShopName();
    const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
    const [chatSideModalOpen, setChatSideModalOpen] =
        React.useState<boolean>(false);

    const toggleForm = React.useCallback(() => {
        setModalIsOpen((m) => !m);
    }, []);

    const toggleChatPane = React.useCallback(() => {
        setChatSideModalOpen((s) => !s);
    }, []);

    return (
        <>
            <CustomerAlertForm
                modalOpen={modalIsOpen}
                toggleModal={toggleForm}
            />
            <ChatSidePane
                isOpen={chatSideModalOpen}
                closeChatPane={toggleChatPane}
            />
            <div className="w-full absolute top-0 left-0 z-20 h-24 flex items-center justify-between p-6">
                <Link
                    href={`/shop/${shopName}`}
                    className="h-12 w-20 flex items-center"
                >
                    <Image
                        src={logo}
                        alt="brand logo"
                        className="object-contain"
                    />
                </Link>
                <div className="ml-auto flex items-center">
                    <div
                        className="flex items-center justify-center mr-6 mt-1 cursor-pointer group transition ease-in-out"
                        onClick={toggleForm}
                    >
                        <Tooltip message="Exclusive deals">
                            <BellIcon className="h-6 w-6 text-gray-200 transition group-hover:font-bold group-hover:scale-125" />
                        </Tooltip>
                    </div>
                    <div
                        className="flex items-center justify-center cursor-pointer  hover:scale-125 group transition ease-in-out"
                        onClick={toggleChatPane}
                    >
                        <ShoppingBagIcon className="h-6 w-6 text-gray-200 group-hover:font-bold" />
                    </div>
                </div>
            </div>
        </>
    );
};
