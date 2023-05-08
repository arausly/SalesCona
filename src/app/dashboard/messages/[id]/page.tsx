"use client";
import { RegularAvatar } from "@components/Avatar/RegularAvatar";
import {
    ArrowLongLeftIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useGetLastPathname } from "@hooks/useGetLastPathname";
import Link from "next/link";

const interactions = [
    {
        sender: "me",
        recipient: "Alice",
        time: "9:23 A.M.",
        content: "Hey Alice, how are you doing today?",
    },
    {
        sender: "Alice",
        recipient: "me",
        time: "9:25 A.M.",
        content: "I'm doing pretty well, thanks for asking. How about you?",
    },
    {
        sender: "me",
        recipient: "Alice",
        time: "9:26 A.M.",
        content:
            "I'm doing pretty well too. I had a good night's sleep and I'm ready to tackle the day. Have you been up to anything interesting lately?",
    },
    {
        sender: "Alice",
        recipient: "me",
        time: "9:29 A.M.",
        content:
            "Actually, I just started taking a yoga class. It's been really challenging, but I'm enjoying it so far. How about you?",
    },
    {
        sender: "me",
        recipient: "Alice",
        time: "9:31 A.M.",
        content:
            "That sounds awesome! I've actually been meaning to get back into yoga myself. Maybe I'll look into taking a class soon.",
    },
    {
        sender: "Alice",
        recipient: "me",
        time: "9:33 A.M.",
        content:
            "Definitely give it a try! It's a great way to destress and get some exercise in at the same time. Anyway, I have to get back to work now. Talk to you later!",
    },
    {
        sender: "me",
        recipient: "Alice",
        time: "9:35 A.M.",
        content: "Sure thing, talk to you later!",
    },
    {
        sender: "me",
        recipient: "Alice",
        time: "10:02 A.M.",
        content:
            "Hey Alice, just wanted to check in and see how your day is going so far?",
    },
    {
        sender: "Alice",
        recipient: "me",
        time: "10:05 A.M.",
        content: "It's going pretty well, thanks for asking. How about you?",
    },
    {
        sender: "me",
        recipient: "Alice",
        time: "10:07 A.M.",
        content:
            "Not bad, just trying to stay productive. Did you have any plans for the weekend?",
    },
];

export default function MessagesPane() {
    const lastPathname = useGetLastPathname();
    const isInASpecificConversation = lastPathname !== "messages";
    return (
        <div
            className={`relative flex flex-col h-full bg-slate-50 relative  ${
                isInASpecificConversation ? "w-full" : "flex-1"
            }`}
        >
            <div className="absolute top-0 left-0 h-10 w-full z-10 bg-white flex items-center cursor-pointer md:pl-4">
                <Link href="/dashboard/messages" className="md:hidden shrink">
                    <div className="w-12 h-8 hover:bg-slate-100 flex items-center">
                        <ArrowLongLeftIcon className="text-black w-12 h-5" />
                    </div>
                </Link>
                <div className="flex-1">
                    <p className="text-black font-semibold">Sophia Wang</p>
                </div>
            </div>
            <div className="overflow-y-auto mt-10 p-4">
                {interactions.map((interaction, i) => {
                    if (interaction.sender === "me") {
                        return (
                            <div
                                key={i}
                                className="flex flex-col mb-6 self-end"
                            >
                                <div className="bg-slate-800 rounded-md h-auto p-2 md:max-w-xs flex-wrap flex self-end items-center">
                                    <p className="text-white font-light text-sm md:text-base">
                                        {interaction.content}
                                    </p>
                                </div>
                                <p className="mt-2 text-gray-500 self-end text-sm md:text-base">
                                    {interaction.time}
                                </p>
                            </div>
                        );
                    }
                    return (
                        <div key={i} className="flex mb-6">
                            <RegularAvatar
                                className="hidden md:flex md:w-10 md:h-10 border-2 border-white"
                                name={interaction.sender}
                            />
                            <div className="flex flex-col">
                                <div className="bg-white rounded-md h-auto p-2 md:max-w-xs flex-wrap flex items-center">
                                    <p className="text-slate-600 font-light text-sm md:text-base">
                                        {interaction.content}
                                    </p>
                                </div>
                                <p className="mt-2 text-gray-500 text-sm md:text-base">
                                    {interaction.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="relative self-center w-full md:w-4/5 bg-white h-20 md:h-16 md:rounded-full md:mb-4">
                <div className="rounded-full cursor-pointer h-8 w-8 primary-bg flex items-center justify-center absolute right-2 bottom-1/2 translate-y-1/2">
                    <PaperAirplaneIcon className="h-5 w-5 text-white" />
                </div>
                <input
                    type="text"
                    id="table-search"
                    className="block p-2 pl-10 text-sm border-slate-100 text-black h-full md:rounded-full w-full"
                    placeholder="Type your message..."
                />
            </div>
        </div>
    );
}
