import ConversationPane from "./ConversationPane";

export default function MessageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="flex flex-row w-full shadow-md overflow-hidden relative"
            style={{
                height: "calc(100vh - 3rem)",
            }}
        >
            <ConversationPane />
            {children}
        </div>
    );
}
