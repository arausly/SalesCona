"use client";
import React from "react";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { storageKeys } from "@lib/constants";
import { onlyIfWindowIsDefined } from "@lib/common.utils";
import { Merchant, MerchantStaff } from "../src/app/dashboard/typing";
import { supabaseTables } from "../db/tables.db";

export const useGetUser = () => {
    const [user, setUser] = React.useState<Merchant | null>(); //todo fix type can be merchant user or staff
    const [forceRefresh, setForceRefresh] = React.useState<boolean>(false);
    const { supabase } = useBrowserSupabase();

    // //ensures the current user is fetched first at most once
    // React.useEffect(() => {
    //     onlyIfWindowIsDefined(() => {
    //         sessionStorage.removeItem(storageKeys.user);
    //     });
    // }, []);

    //subsequent retries per page should feed from the storage if exists
    React.useEffect(() => {
        (async () => {
            onlyIfWindowIsDefined(async () => {
                if (forceRefresh) {
                    sessionStorage.removeItem(storageKeys.user);
                    setForceRefresh(false); //run again, by then you would be false;
                } else {
                    const storedUser = sessionStorage.getItem(storageKeys.user);
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        let user;
                        let isMerchantOwner = false;
                        const {
                            data: { user: authUserInfo }
                        } = await supabase.auth.getUser();

                        if (authUserInfo) {
                            const { data: merchant, error } = await supabase
                                .from(supabaseTables.merchants)
                                .select()
                                .eq("id", authUserInfo.id);

                            if (merchant?.length && !error) {
                                //user is a merchant
                                user = {
                                    ...authUserInfo,
                                    ...merchant[0]
                                } as Merchant;
                                isMerchantOwner = true;
                            } else {
                                //check if user auth id corresponds to merchant staff instead
                                const {
                                    data: merchantStaff,
                                    error: staffError
                                } = await supabase
                                    .from(supabaseTables.merchant_staffs)
                                    .select("*,owner(*)")
                                    .eq("id", authUserInfo.id);
                                if (merchantStaff?.length && !staffError) {
                                    user = {
                                        ...authUserInfo,
                                        ...merchantStaff[0]
                                    };
                                    isMerchantOwner = false;
                                }
                            }

                            if (user) {
                                sessionStorage.setItem(
                                    storageKeys.user,
                                    JSON.stringify(user)
                                );
                                setUser(user as MerchantStaff);

                                //update last active info on merchant
                                await supabase
                                    .from(
                                        isMerchantOwner
                                            ? supabaseTables.merchants
                                            : supabaseTables.merchant_staffs
                                    )
                                    .update({
                                        last_active:
                                            authUserInfo.last_sign_in_at
                                    })
                                    .eq("id", user.id);
                            }
                        }
                    }
                }
            });
        })();
    }, [supabase.auth, forceRefresh]);

    return { user, setForceRefresh };
};
