"use client";

import React from "react";
import { Tab } from "@headlessui/react";

//components
import { Profile } from "./tabs/profile";
import { ChangePassword } from "./tabs/change-password";
import { Team } from "./tabs/team/team";
import { UsageTab } from "./tabs/usages";

//hooks
import { usePathname, useRouter } from "next/navigation";

//context
import { SettingsProvider } from "./contexts/setting.context";

const tabIndexesByType = {
    profile: 0,
    password: 1,
    team: 2,
    usages: 3
} as const;

const tabIds = {
    "0": "profile",
    "1": "password",
    "2": "team",
    "3": "usages"
} as Record<string, string>;

export default function Setting({
    searchParams
}: {
    searchParams: { tab: keyof typeof tabIndexesByType };
}) {
    const router = useRouter();
    const pathname = usePathname();

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

    return (
        <SettingsProvider>
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
                                <Team />
                            </Tab.Panel>
                            <Tab.Panel>
                                <UsageTab />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </section>
        </SettingsProvider>
    );
}
