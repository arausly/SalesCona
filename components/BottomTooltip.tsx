import { ReactNode } from "react";

const posStyles = {
    bottom: "group-hover:translate-y-[2rem] bottom-0 left-1/2 translate-y-[3rem] translate-x-[-50%]",
    left: "left-0 top-[-5%] group-hover:translate-x-[-105%] translate-x-[-140%]"
};

interface TooltipProps {
    message: string;
    pos?: keyof typeof posStyles;
    children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
    message,
    pos = "bottom",
    children
}) => {
    return (
        <div className="relative group">
            {children}
            <div
                className={`flex justify-center items-center absolute w-max opacity-0 ${posStyles[pos]} transition ease-in-out group-hover:opacity-100 rounded-md bg-[#3C4048] py-1 px-4`}
            >
                <p className="text-white font-light text-sm normal-case">
                    {message}
                </p>
            </div>
        </div>
    );
};
