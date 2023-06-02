import { ReactNode } from "react";

interface BottomTooltipProps {
    message: string;
    children: ReactNode;
}

export const BottomTooltip: React.FC<BottomTooltipProps> = ({
    message,
    children
}) => {
    return (
        <div className="relative group">
            {children}
            <div className="flex justify-center items-center absolute w-max opacity-0 transition ease-in-out group-hover:opacity-100 group-hover:translate-y-[2.5rem] bottom-0 left-1/2 translate-y-[3rem] translate-x-[-50%] rounded-md bg-[#3C4048] py-1 px-4">
                <p className="text-white font-light text-sm normal-case">
                    {message}
                </p>
            </div>
        </div>
    );
};
