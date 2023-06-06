import React from "react";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChatProductBlock } from "./ChatProductBlock";

interface ChatSidePaneProps {
    isOpen: boolean;
    closeChatPane: () => void;
}

export const ChatSidePane: React.FC<ChatSidePaneProps> = ({
    isOpen,
    closeChatPane
}) => {
    const [email, setEmail] = React.useState<string>(""); //todo change to API data
    return (
        <div
            className={`absolute ${
                isOpen ? "w-full h-full opacity-100" : "w-0 h-0 opacity-0"
            }`}
        >
            {/**backdrop*/}
            <span
                onClick={closeChatPane}
                className={`absolute opacity-30 z-30 transition top-0 right-0 bottom-0 left-0 bg-black ${
                    isOpen ? "inline-block" : "hidden z-10"
                }`}
            />
            <div
                className={`absolute z-30 top-0 right-0 bottom-0 transition ease-in-out shadow-md h-full flex w-full flex-col bg-white p-8 md:w-3/5 lg:w-2/5 ${
                    isOpen ? "translate-x-[0%]" : "translate-x-[100%]"
                }`}
            >
                <div className="flex items-center justify-between">
                    <p>My Messages</p>
                    <XMarkIcon
                        onClick={closeChatPane}
                        className="h-7 w-7 cursor-pointer text-black transition hover:text-gray-600"
                    />
                </div>
                <div className="fixed left-0 bottom-40 md:bottom-32 w-full">
                    <ChatProductBlock />
                </div>
                {!email ? (
                    <div className="h-20 md:h-16 fixed left-0 bottom-20 md:bottom-16 w-full flex">
                        <input
                            type="email"
                            className="flex-1 block p-2 pl-10 text-sm border-l-0 border-t-0 border-b-0 border-r border-slate-100 text-black h-full"
                            placeholder="email@example.com"
                        />
                        <input
                            type="text"
                            className="flex-1 block p-2 pl-10 text-sm border-transparent border-b-0  border-slate-100 text-black h-full"
                            placeholder="Full name"
                        />
                    </div>
                ) : null}
                <div className="fixed bottom-0 self-center w-full bg-white h-20 md:h-16">
                    <div className="rounded-full cursor-pointer h-8 w-8 primary-bg flex items-center justify-center absolute right-2 bottom-1/2 translate-y-1/2">
                        <PaperAirplaneIcon className="h-5 w-5 text-white" />
                    </div>
                    <input
                        type="text"
                        className="block p-2 pl-10 text-sm border-slate-100 text-black h-full w-full"
                        placeholder="Type your message..."
                    />
                </div>
            </div>
        </div>
    );
};
