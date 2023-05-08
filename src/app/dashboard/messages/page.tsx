import Image from "next/image";

//image
import chatImage from "@assets/images/chat.svg";

export default function Messages() {
    return (
        <div className="flex-col hidden md:flex items-center justify-center h-full w-full">
            <div>
                <Image src={chatImage} alt="chat" />

                <p className="text-4xl text-gray-950 font-bold">
                    Select a message
                </p>
                <p className="text-xl text-gray-400 font-thin mt-3">
                    Choose from your existing messages, from the left
                    conversation pane
                </p>
            </div>
        </div>
    );
}
