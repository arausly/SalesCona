import { Slider } from "./components/Slider";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

export default function ShopLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="w-full h-full relative overflow-x-hidden">
            <Navbar />
            <Slider />
            {children}
            <Footer />
        </section>
    );
}
