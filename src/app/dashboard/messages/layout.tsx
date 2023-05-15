import ConversationPane from "./ConversationPane";

export default function MessageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="md:p-6">
            <div className="flex flex-row w-full shadow-md overflow-hidden relative dashboard-screen-height">
                <ConversationPane />
                {children}
            </div>
        </div>
    );
}
