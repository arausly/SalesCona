import SupabaseProvider from "@lib/supabaseBrowser";

//styles
import "./globals.css";

//font
import { Poppins } from "next/font/google";

const poppin = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});

export const metadata = {
    title: "kolony-buy",
    description: "simple solution for taking your shop digital",
    icons: {
        icon: "/kolony-logo.webp",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${poppin.className} h-full bg-white`}>
            <body className="v-screen h-screen">
                <SupabaseProvider>{children}</SupabaseProvider>
            </body>
        </html>
    );
}
