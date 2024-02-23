import SupabaseProvider from "@lib/supabaseBrowser";

//styles
import "./globals.css";

//font
import { Lato } from "next/font/google";

const raleway = Lato({
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"]
});

export const metadata = {
    title: "SalesCona",
    description: "simple solution for taking your shop digital",
    icons: {
        icon: "/kolony-logo.webp"
    }
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${raleway.className} h-full bg-white`}>
            <body className="v-screen h-screen">
                <SupabaseProvider>{children}</SupabaseProvider>
            </body>
        </html>
    );
}
