"use client";
import React from "react";

//utils
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { storageKeys } from "@lib/constants";
import { onlyIfWindowIsDefined } from "@lib/common.utils";

//typings
import { tables } from "@db/tables.db";
import { User } from "@db/typing/merchantStaff.typing";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { getMerchantByAuthId } from "@services/merchant/merchant.services";
import { getMerchantStaffByAuthId } from "@services/staff/staff.service";

export const useGetUser = () => {
    const [user, setUser] = React.useState<User>(() =>
        onlyIfWindowIsDefined(() => {
            const storedUser = sessionStorage.getItem(storageKeys.user);
            return storedUser ? JSON.parse(storedUser) : undefined;
        })
    );
    const [forceRefresh, setForceRefresh] = React.useState<boolean>(false);
    const { supabase } = useBrowserSupabase();

    //subsequent retries per page should feed from the storage if exists
    React.useEffect(() => {
        (async () => {
            onlyIfWindowIsDefined(async () => {
                if (forceRefresh) {
                    sessionStorage.removeItem(storageKeys.user);
                    setForceRefresh(false); //run again, by then you would be false;
                } else {
                    const storedUser = sessionStorage.getItem(storageKeys.user);
                    if (storedUser && storedUser !== "undefined") {
                        setUser(JSON.parse(storedUser));
                    } else {
                        const {
                            data: { user: userData }
                        } = await supabase.auth.getUser();

                        const isMerchant = !!userData?.user_metadata.merchant;

                        if (userData) {
                            await initializeUserInfo(userData, isMerchant);
                            ///track to record when users signed in last
                            await supabase
                                .from(
                                    isMerchant
                                        ? tables.merchants
                                        : tables.merchantStaffs
                                )
                                .update({
                                    last_sign_in_at: userData.last_sign_in_at
                                })
                                .eq("id", userData.id);
                        }
                    }
                }
            });
        })();
    }, [supabase.auth, forceRefresh]);

    const initializeUserInfo = React.useCallback(
        (user: SupabaseUser, isMerchant: boolean) => {
            const util = isMerchant
                ? getMerchantByAuthId
                : getMerchantStaffByAuthId;
            util(user.id).then(({ data }) => {
                if (!data?.length) return;
                const currentUser = data[0];
                setUser((prevUser) => {
                    //supabase auth id is overwritten by merchant or staff id
                    const updatedUser = {
                        ...(prevUser ?? {}),
                        ...user,
                        ...currentUser
                    } as User;
                    sessionStorage.setItem(
                        storageKeys.user,
                        JSON.stringify(updatedUser)
                    );
                    return updatedUser;
                });
            });
        },
        []
    );

    const triggerUpdate = React.useCallback(() => setForceRefresh(true), []);

    return { user, triggerUpdate };
};
