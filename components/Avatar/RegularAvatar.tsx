"use client";
import React from "react";
import { generateAvatarBg, generateAvatarInitials } from "@lib/format-utils";

interface IProps {
    name: string;
    className?: string;
}

export const RegularAvatar: React.FC<IProps> = ({ name, className }) => {
    const backgroundColor = React.useMemo(() => generateAvatarBg(), []);
    const initials = React.useMemo(() => generateAvatarInitials(name), [name]);

    return (
        <div
            style={{
                backgroundColor,
            }}
            className={`uppercase flex flex-col items-center justify-center w-12 h-12 rounded-full ${className}`}
        >
            <p className="text-sm md:text-lg text-gray-600">{initials} </p>
        </div>
    );
};
