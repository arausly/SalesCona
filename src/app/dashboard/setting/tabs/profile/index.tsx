"use client";
import React from "react";

//components
import { RegularAvatar } from "@components/Avatar/RegularAvatar";
import { Button } from "@components/Button";
import { inputClasses } from "@components/Input/input";

//hooks
import { useGetUser } from "@hooks/useGetUser";
import { useBrowserSupabase } from "@lib/supabaseBrowser";

//db
import { tables } from "@db/tables.db";

interface ProfileFormState {
    firstname: string;
    lastname: string;
}

export const Profile = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [formState, setFormState] = React.useState<ProfileFormState>({
        firstname: "",
        lastname: ""
    });
    const { supabase } = useBrowserSupabase();
    const { user, triggerUpdate } = useGetUser();

    React.useEffect(() => {
        if (user) {
            const { firstname, lastname } = user;
            setFormState({ firstname, lastname });
        }
    }, [user]);

    const handleFormStateChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            setFormState(
                (prev) =>
                    ({
                        ...(prev ?? {}),
                        [name]: value
                    }) as ProfileFormState
            );
        },
        []
    );

    const updatingUserInfo = React.useCallback(
        async (e: React.ChangeEvent<HTMLFormElement>) => {
            if (!user) return;
            e.preventDefault();
            try {
                setLoading(true);
                const { data, error } = await supabase.auth.updateUser({
                    data: formState
                });
                if (data && !error) {
                    //update secondary storage as well.
                    await supabase
                        .from(tables.merchants)
                        .update({ ...formState })
                        .eq("id", user.id);
                    triggerUpdate();
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        },
        [formState, user]
    );

    if (!user) return null;
    const { firstname, lastname } = user;
    const name = `${firstname} ${lastname}`;

    // if the user updated either the firstname or the lastname.
    const changeExist =
        firstname !== formState?.firstname || lastname !== formState?.lastname;
    const disabled = loading || !changeExist;

    return (
        <section className="flex flex-col w-full items-center justify-center px-6 mt-16 lg:px-8">
            <div className="flex items-center">
                <RegularAvatar name={name} className="mr-6" />
                <div className="flex flex-col">
                    <p className="capitalize">{name}</p>
                    <p>{user?.email ?? ""}</p>
                </div>
            </div>
            <form
                className="mt-8 space-y-6 w-full md:w-2/4"
                onSubmit={updatingUserInfo}
            >
                <div>
                    <label
                        htmlFor="firstname"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Firstname
                    </label>
                    <div className="mt-2">
                        <input
                            id="firstname"
                            type="text"
                            name="firstname"
                            value={formState?.firstname}
                            onChange={handleFormStateChange}
                            placeholder="John"
                            className={inputClasses({
                                mode: "default"
                            })}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="lastname"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Lastname
                    </label>
                    <div className="mt-2">
                        <input
                            id="lastname"
                            name="lastname"
                            type="text"
                            value={formState?.lastname}
                            onChange={handleFormStateChange}
                            placeholder="Doe"
                            className={inputClasses({
                                mode: "default"
                            })}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Email address
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="john-doe@yahoo.com"
                            className={inputClasses({
                                mode: "default"
                            })}
                            required
                            disabled
                        />
                    </div>
                </div>
                <div>
                    <Button
                        loading={loading}
                        loadingText="Saving"
                        text="Save Changes"
                        type="submit"
                        disabled={disabled}
                        className={`${
                            disabled
                                ? "bg-[#6d67e47f]"
                                : "primary-bg hover:bg-indigo-500"
                        } flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    />
                </div>
            </form>
        </section>
    );
};
