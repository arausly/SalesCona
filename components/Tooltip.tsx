import { ReactNode } from "react";
import {
    Tooltip as ShadTooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@components/ui/tooltip";

interface TooltipProps {
    message: string;
    children: ReactNode;
    tooltipContentClasses?: string;
    side?: "top" | "right" | "bottom" | "left";
}

export const Tooltip: React.FC<TooltipProps> = ({
    message,
    children,
    tooltipContentClasses = "",
    side
}) => {
    return (
        <TooltipProvider>
            <ShadTooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent className={tooltipContentClasses} side={side}>
                    <p>{message}</p>
                </TooltipContent>
            </ShadTooltip>
        </TooltipProvider>
    );
};
