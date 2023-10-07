"use client";
import { useGetUser } from "../../hooks/useGetUser";
import { RegularAvatar } from "./RegularAvatar";

export const ProfileAvatar = (props: any) => {
    const { user } = useGetUser();
    if (!user) return null;
    const name =
        user.user_metadata?.full_name ??
        `${user.user_metadata?.firstname} ${user.user_metadata.lastname}`;
    return <RegularAvatar className="block md:hidden" name={name} />;
};
