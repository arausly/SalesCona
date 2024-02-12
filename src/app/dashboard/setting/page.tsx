"use client";

import React from "react";
import { Tab } from "@headlessui/react";
import { Profile } from "./components/profile";
import { ChangePassword } from "./components/change-password";
import { Team } from "./components/team";
import { Payment } from "./components/payment";
import { usePathname, useRouter } from "next/navigation";
import { Permission, Role } from "../typing";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { useGetUser } from "@hooks/useGetUser";
import { SubscriptionMetadata, SubscriptionPlan } from "./typing";
import { supabaseTables } from "../../../../db/tables.db";

const tabIndexesByType = {
    profile: 0,
    password: 1,
    team: 2,
    subscription: 3
} as const;

const tabIds = {
    "0": "profile",
    "1": "password",
    "2": "team",
    "3": "subscription"
} as Record<string, string>;

export default function Setting({
    searchParams
}: {
    searchParams: { tab: keyof typeof tabIndexesByType };
}) {
    const [roles, setRoles] = React.useState<Role[]>([]); //roles created by staff
    const [permissions, setPermissions] = React.useState<Permission[]>([]); //permissions per role
    const [subscriptions, setSubscriptions] = React.useState<
        SubscriptionMetadata[]
    >([]);
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useGetUser();
    const { supabase } = useBrowserSupabase();

    const handleTabChange = (index: number) => {
        router.push(
            pathname + "?" + createQueryString("tab", tabIds[index.toString()])
        );
    };

    const createQueryString = React.useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    //fetch owner roles
    React.useEffect(() => {
        (async () => {
            if (user) {
                const { data, error } = await supabase
                    .from(supabaseTables.roles)
                    .select()
                    .eq("merchant", user.id)
                    .returns<Role[]>();

                if (data && !error) {
                    setRoles(data);
                }
            }
        })();
    }, [user]);

    //listen for roles updates
    React.useEffect(() => {
        const subscription = supabase
            .channel(supabaseTables.roles)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: supabaseTables.roles
                },
                (payload) => {
                    setRoles((roles) => [...roles, payload.new as Role]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        (async () => {
            const { data, error } = await supabase
                .from(supabaseTables.permissions)
                .select()
                .returns<Permission[]>();
            if (data && !error) {
                setPermissions(data);
            }
        })();
    }, []);
    //todo coming back to this shortly
    // React.useEffect(() => {
    //     (async () => {
    //         const { data, error } = await supabase
    //             .from(supabaseTables.subscriptions)
    //             .select()
    //             .returns<Array<SubscriptionMetadata>>();

    //         if (data && !error) {
    //             setSubscriptions(() => data);
    //         }
    //     })();
    // }, []);

    return (
        <section className="dashboard-screen-height overflow-auto p-6 px-4 md:px-20 w-full">
            <div className="flex flex-col">
                <h3 className="text-lg md:text-2xl font-normal">Account</h3>
                <p className="mt-1 text-zinc-500">
                    Modify account settings below
                </p>
            </div>

            <div className="mt-8">
                <Tab.Group
                    selectedIndex={tabIndexesByType[searchParams.tab] ?? 0}
                    onChange={handleTabChange}
                >
                    <Tab.List className="bg-[#F8F6F4] p-1.5 rounded-md w-full flex justify-between">
                        {Object.values(tabIds).map((tab, i) => (
                            <Tab className="flex-1" key={tab}>
                                {({ selected }) => (
                                    <div
                                        className={
                                            selected
                                                ? "w-full h-9 flex items-center justify-center px-3 bg-white rounded-md transition"
                                                : ""
                                        }
                                    >
                                        <p
                                            className={`capitalize text-sm md:text-base ${
                                                selected
                                                    ? "primary-color transition"
                                                    : ""
                                            }`}
                                        >
                                            {tab}
                                        </p>
                                    </div>
                                )}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <Profile />
                        </Tab.Panel>
                        <Tab.Panel>
                            <ChangePassword />
                        </Tab.Panel>
                        <Tab.Panel>
                            <Team roles={roles} permissions={permissions} />
                        </Tab.Panel>
                        <Tab.Panel>
                            <Payment subscriptions={subscriptions} />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </section>
    );
}
