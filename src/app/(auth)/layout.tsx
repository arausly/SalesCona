import Image from "next/image";
import { Inter } from "next/font/google";

import authImage from "@assets/images/auth-image.jpeg";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Auth page", //todo change based on specific auth page
    description: "simple solution for taking your shop digital"
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="v-screen h-screen flex flex-row">
            <div className="w-full md:w-1/2">{children}</div>
            <div className="hidden md:block w-1/2 h-full bg-fixed">
                <Image
                    className="mx-auto bg-contain"
                    src={authImage}
                    alt="Authentication form"
                    placeholder="blur"
                    style={{ height: "100%" }}
                />
            </div>
        </div>
    );
}
