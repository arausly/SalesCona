"use client";
import React from "react";

//utils
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { storageKeys } from "@lib/constants";
import { onlyIfWindowIsDefined } from "@lib/common.utils";

//typings
import { User } from "@supabase/supabase-js";
import { tables } from "@db/tables.db";

export const useGetUser = () => {
    const [user, setUser] = React.useState<User>();
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
                        const {
                            data: { user: authUserInfo }
                        } = await supabase.auth.getUser();
                        if (authUserInfo) {
                            sessionStorage.setItem(
                                storageKeys.user,
                                JSON.stringify(authUserInfo)
                            );
                            setUser(authUserInfo);

                            ///track to record when users signed in last
                            const isMerchant =
                                authUserInfo?.user_metadata.merchant;
                            await supabase
                                .from(
                                    isMerchant
                                        ? tables.merchants
                                        : tables.merchantStaffs
                                )
                                .update({
                                    last_sign_in_at:
                                        authUserInfo.last_sign_in_at
                                })
                                .eq("id", authUserInfo.id);
                        }
                    }
                }
            });
        })();
    }, [supabase.auth, forceRefresh]);

    return { user, setForceRefresh };
};
