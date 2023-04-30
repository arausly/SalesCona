import SupabaseProvider from "@lib/supabaseBrowser";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
        <html lang="en">
            <body className="v-screen h-screen">
                <SupabaseProvider>{children}</SupabaseProvider>
            </body>
        </html>
    );
}
