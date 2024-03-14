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

/**
 * When a user signs up, either as a merchant or staff.
 * the table data gets added as a metadata,
 * however in-app a different convention is expected for ease of work
 * @param user
 * @returns
 */
const reconstructUser = <T>(user: SupabaseUser): T => {
    const merchantStaff = user.user_metadata.merchant_staff;
    if (merchantStaff) {
        return {
            ...merchantStaff,
            ...user,
            user_metadata: undefined
        } as T;
    }
    const merchant = user.user_metadata.merchant;
    return {
        ...merchant,
        ...user,
        user_metadata: undefined
    } as T;
};

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
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        const {
                            data: { user: userData }
                        } = await supabase.auth.getUser();
                        if (userData) {
                            sessionStorage.setItem(
                                storageKeys.user,
                                JSON.stringify(userData)
                            );
                            const isMerchant =
                                !!userData?.user_metadata.merchant;

                            const reconstructedUser = isMerchant
                                ? reconstructUser<Merchant>(userData)
                                : reconstructUser<MerchantStaff>(userData);

                            setUser(reconstructedUser as User);

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

    return { user, setForceRefresh };
};
