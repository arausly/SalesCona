"use client";
import React from "react";
import { generateAvatarBg, generateAvatarInitials } from "@lib/format-utils";

const avatarSizes = {
    normal: "w-12 h-12",
    small: "w-8 h-8",
    medium: "w-10 h-10"
};

interface IProps {
    name: string;
    className?: string;
    size?: keyof typeof avatarSizes;
}

export const RegularAvatar: React.FC<IProps> = React.memo(
    ({ name, className, size = "normal" }) => {
        const backgroundColor = React.useMemo(() => generateAvatarBg(), []);
        const initials = React.useMemo(
            () => generateAvatarInitials(name),
            [name]
        );

        return (
            <div
                style={{
                    backgroundColor
                }}
                className={`uppercase flex flex-col items-center justify-center ${avatarSizes[size]} rounded-full ${className}`}
            >
                <p
                    className={`text-sm ${
                        size === "small" ? "" : "md:text-lg"
                    } text-gray-600`}
                >
                    {initials}{" "}
                </p>
            </div>
        );
    }
);
