import { cva } from "class-variance-authority";

export const inputClasses = cva(
    [
        "block w-full",
        "rounded-md",
        "py-1.5",
        "text-gray-900",
        "shadow-sm",
        "ring-1",
        "ring-inset",
        "ring-gray-300",
        "placeholder:text-gray-400",
        "focus:ring-2",
        "focus:ring-inset",
        "sm:text-sm",
        "sm:leading-6",
        "pl-3"
    ],
    {
        variants: {
            mode: {
                default: ["border-0", "focus:ring-indigo-600"],
                error: [
                    "border-2",
                    "border-rose-500",
                    "focus:ring-none",
                    "ring-0",
                    "outline-none"
                ]
            }
        },
        defaultVariants: {
            mode: "default"
        }
    }
);
