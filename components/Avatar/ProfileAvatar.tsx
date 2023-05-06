"use client";
import { generateAvatarBg, generateAvatarInitials } from "@lib/format-utils";
import { useGetUser } from "../../hooks/useGetUser";

export const ProfileAvatar = (props: any) => {
    const user = useGetUser();
    if (!user) return null;

    return (
        <div
            style={{ backgroundColor: generateAvatarBg() }}
            className="w-8 h-8 rounded-full uppercase flex flex-col items-center justify-center block md:hidden"
        >
            <p className="text-sm text-slate-800">
                {generateAvatarInitials(
                    `${user.user_metadata?.firstname} ${user.user_metadata.lastname}`
                )}
            </p>
        </div>
    );
};
