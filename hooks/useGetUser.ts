"use client";
import React from "react";

//utils
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { storageKeys } from "@lib/constants";
import { onlyIfWindowIsDefined } from "@lib/common.utils";

//typings
import { tables } from "@db/tables.db";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Merchant } from "@db/typing/merchant.typing";
import { MerchantStaff, User } from "@db/typing/merchantStaff.typing";
import { getMerchantByAuthId } from "@services/merchant/merchant.services";
import { getMerchantStaffByAuthId } from "@services/staff/staff.service";

export const useGetUser = () => {
    const [user, setUser] = React.useState<User>();
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
                            await updateUser(userData.id, isMerchant);
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

    const updateUser = React.useCallback(
        (authId: string, isMerchant: boolean) => {
            const util = isMerchant
                ? getMerchantByAuthId
                : getMerchantStaffByAuthId;
            util(authId).then(({ data }) => {
                if (!data?.length) return;
                const currentUser = data[0];
                setUser((prevUser) => {
                    const updatedUser = {
                        ...(prevUser ?? {}),
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

    return { user, setForceRefresh, updateUser };
};
