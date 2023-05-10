"use client";
import React from "react";
import { truncateString } from "@lib/format-utils";
import Link from "next/link";
import { RegularAvatar } from "@components/Avatar/RegularAvatar";
import { useGetLastPathname } from "@hooks/useGetLastPathname";
import { SearchField } from "@components/Input/SearchField";

const messages = [
    {
        id: "3d87b820-aa1d-4cf5-baba-eab9fb3d8f94",
        name: "Megan Johnson",
        date: "01/04/2023",
        unread: true,
        content: "Hey there, how are you doing today?",
    },
    {
        id: "f285a8b6-7f5a-4e7a-82a4-9c1a5f6d94c3",
        name: "David Lee",
        date: "18/07/2023",
        unread: false,
        content: "Hi Megan, I'm good thanks. How about you?",
    },
    {
        id: "69ebe75c-f2ce-49a3-a3cb-4f6d2a0d0a89",
        name: "Liam Chen",
        date: "11/08/2023",
        unread: false,
        content: "Hey David, what are you up to?",
    },
    {
        id: "1e7a2e7c-3ca8-4d2f-9c9b-4e9f5b5b0137",
        name: "Emma Davis",
        date: "03/05/2023",
        unread: true,
        content: "Hi Liam, how's everything going?",
    },
    {
        id: "c4fcd2e-2d7e-471a-b8c6-4b7b6df7c9c2",
        name: "Sophia Wang",
        date: "25/06/2023",
        unread: true,
        content: "Hi Emma, I'm doing well. How about you?",
    },
    {
        id: "d9a7b5ed-2e72-4fb8-ae6e-779f1a3653b1",
        name: "Ethan Brown",
        date: "14/09/2023",
        unread: false,
        content: "Hey Sophia, what have you been up to lately?",
    },
    {
        id: "3b4a6c57-4f7e-424a-8a04-416ba8331c8b",
        name: "Olivia Patel",
        date: "29/05/2023",
        unread: false,
        content: "Hi Ethan, not much. How about you?",
    },
    {
        id: "f0f75a19-6983-4b36-861c-821fc6794aa2",
        name: "Noah Garcia",
        date: "21/08/2023",
        unread: true,
        content: "Hey Olivia, do you want to hang out this weekend?",
    },
    {
        id: "8f0df524-01ab-4e10-aad9-73e6b33828c5",
        name: "Ava Rodriguez",
        date: "10/06/2023",
        unread: true,
        content: "Hi Noah, that sounds great. What do you want to do?",
    },
    {
        id: "3cafbf60-d4a3-437c-87e7-79c9c5c918de",
        name: "William Kim",
        date: "06/07/2023",
        unread: false,
        content: "Hey Ava, have you tried that new restaurant downtown yet?",
    },
];

const ConversationPane = () => {
    const lastPathname = useGetLastPathname();
    const isInASpecificConversation = lastPathname !== "messages";

    return (
        <div
            className={`flex flex-col h-full w-full md:w-max ${
                isInASpecificConversation ? "hidden md:flex" : ""
            }`}
        >
            <SearchField
                className="border-b border-slate-100"
                placeholder="Search messages"
            />
            <div className="overflow-y-auto border">
                {messages.map((message) => {
                    return (
                        <Link
                            href={`/dashboard/messages/${message.id}`}
                            key={message.name}
                        >
                            <div
                                className={`flex flex-col p-4 cursor-pointer transition ease-in-out hover:bg-slate-100 ${
                                    message.id === lastPathname
                                        ? "border-r-2 border-[#3641fc]"
                                        : "border-b border-slate-100"
                                } ${message.unread ? "bg-slate-50" : ""}`}
                            >
                                <div className="flex flex-row justify-between">
                                    <div className="flex flex-row items-center">
                                        <RegularAvatar
                                            className="h-8 w-8 md:w-10 md:h-10"
                                            name={message.name}
                                        />
                                        <p className="capitalize ml-2 text-semibold text-sm md:text-base">
                                            {message.name}
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-400 font-light">
                                        {message.date}
                                    </p>
                                </div>
                                <p className="mt-2 font-light text-gray-400 text-sm md:text-base truncate">
                                    {truncateString(message.content, 40)}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ConversationPane;
