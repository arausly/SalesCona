import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import {
    generateAvatarBg,
    generateAvatarInitials,
    truncateString,
} from "@lib/format-utils";

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

const messages = [
    {
        name: "Megan Johnson",
        date: "01/04/2023",
        unread: true,
        content: "Hey there, how are you doing today?",
    },
    {
        name: "David Lee",
        date: "18/07/2023",
        unread: false,
        content: "Hi Megan, I'm good thanks. How about you?",
    },
    {
        name: "Liam Chen",
        date: "11/08/2023",
        unread: false,
        content: "Hey David, what are you up to?",
    },
    {
        name: "Emma Davis",
        date: "03/05/2023",
        unread: true,
        content: "Hi Liam, how's everything going?",
    },
    {
        name: "Sophia Wang",
        date: "25/06/2023",
        unread: true,
        content: "Hi Emma, I'm doing well. How about you?",
    },
    {
        name: "Ethan Brown",
        date: "14/09/2023",
        unread: false,
        content: "Hey Sophia, what have you been up to lately?",
    },
    {
        name: "Olivia Patel",
        date: "29/05/2023",
        unread: false,
        content: "Hi Ethan, not much. How about you?",
    },
    {
        name: "Noah Garcia",
        date: "21/08/2023",
        unread: true,
        content: "Hey Olivia, do you want to hang out this weekend?",
    },
    {
        name: "Ava Rodriguez",
        date: "10/06/2023",
        unread: true,
        content: "Hi Noah, that sounds great. What do you want to do?",
    },
    {
        name: "William Kim",
        date: "06/07/2023",
        unread: false,
        content: "Hey Ava, have you tried that new restaurant downtown yet?",
    },
];

export default function Messages() {
    return (
        <div className="flex flex-row w-full h-5/6 shadow-md overflow-hidden">
            <div className="flex flex-col h-full w-max">
                <div className="relative border-b border-slate-100">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-500"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        className="block p-2 pl-10 text-sm text-black border border-gray-50 border-b-0 w-full"
                        placeholder="Search messages"
                    />
                </div>
                <div className="overflow-y-auto border">
                    {messages.map((message) => (
                        <div
                            key={message.name}
                            className={`flex flex-col p-4 ${
                                message.unread
                                    ? "border-r-2 bg-slate-100 border-blue-800"
                                    : "border-b border-slate-100"
                            }`}
                        >
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row items-center">
                                    <div
                                        style={{
                                            backgroundColor: generateAvatarBg(),
                                        }}
                                        className="uppercase flex flex-col items-center justify-center w-12 h-12 rounded-full"
                                    >
                                        <p className="text-lg text-gray-600">
                                            {generateAvatarInitials(
                                                message.name
                                            )}{" "}
                                        </p>
                                    </div>
                                    <p className="capitalize ml-2 text-semibold text-base">
                                        {message.name}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-400 font-light">
                                    {message.date}
                                </p>
                            </div>
                            <p className="mt-2 font-light text-gray-400 truncate">
                                {truncateString(message.content, 40)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col h-full flex-1 bg-slate-50 relative p-4 ">
                <div className="overflow-y-auto">
                    {interactions.map((interaction, i) => {
                        if (interaction.sender === "me") {
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col mb-6 self-end"
                                >
                                    <div className="bg-slate-800 rounded-md h-auto p-2 max-w-xs flex-wrap flex self-end items-center">
                                        <p className="text-white font-light">
                                            {interaction.content}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-gray-500 self-end">
                                        {interaction.time}
                                    </p>
                                </div>
                            );
                        }
                        return (
                            <div key={i} className="flex mb-6">
                                <div
                                    style={{
                                        backgroundColor: generateAvatarBg(),
                                    }}
                                    className="uppercase flex flex-col items-center justify-center w-10 h-10 border-2 border-white rounded-full mr-3"
                                >
                                    <p className="text-base text-gray-600">
                                        {generateAvatarInitials(
                                            interaction.sender
                                        )}
                                    </p>
                                </div>
                                <div className="flex flex-col">
                                    <div className="bg-white rounded-md h-auto p-2 max-w-xs flex-wrap flex items-center">
                                        <p className="text-slate-600 font-light">
                                            {interaction.content}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-gray-500">
                                        {interaction.time}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="relative self-center w-4/5 bg-white h-12 rounded-full mb-4">
                    <div className="rounded-full cursor-pointer h-8 w-8 primary-bg flex items-center justify-center absolute right-2 bottom-1/2 translate-y-1/2">
                        <PaperAirplaneIcon className="h-5 w-5 text-white" />
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        className="block p-2 pl-10 text-sm border-slate-100 text-black h-full rounded-full w-full"
                        placeholder="Type your message..."
                    />
                </div>
            </div>
        </div>
    );
}
