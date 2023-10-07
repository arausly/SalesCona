import { RegularAvatar } from "@components/Avatar/RegularAvatar";
import { useGetUser } from "@hooks/useGetUser";

export const Profile = () => {
    const user = useGetUser();

    if (!user) return null;
    const name =
        user.user_metadata?.full_name ??
        `${user?.user_metadata?.firstname} ${user.user_metadata.lastname}`;

    return (
        <section className="flex flex-col w-full items-center justify-center px-6 mt-8 lg:px-8">
            <div className="flex items-center">
                <RegularAvatar name={name} className="mr-6" />
                <div className="flex flex-col">
                    <p className="capitalize">{name}</p>
                    <p>{user?.email ?? ""}</p>
                </div>
            </div>
        </section>
    );
};
