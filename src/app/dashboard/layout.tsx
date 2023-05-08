import Sidebar from "@components/Sidebar/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="w-full">{children}</div>
        </div>
    );
}
