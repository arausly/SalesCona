"use client";
import React from "react";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { User } from "@supabase/supabase-js";
import { storageKeys } from "@lib/constants";
import { onlyIfWindowIsDefined } from "@lib/common.utils";

export const useGetUser = () => {
    const [user, setUser] = React.useState<User | null>();
    const [forceRefresh, setForceRefresh] = React.useState<boolean>(false);
    const { supabase } = useBrowserSupabase();

    //ensures the current user is fetched first at most once
    React.useEffect(() => {
        onlyIfWindowIsDefined(() => {
            sessionStorage.removeItem(storageKeys.user);
        });
    }, []);

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
                            data: { user: userInfo }
                        } = await supabase.auth.getUser();
                        sessionStorage.setItem(
                            storageKeys.user,
                            JSON.stringify(userInfo)
                        );
                        setUser(userInfo);
                    }
                }
            });
        })();
    }, [supabase.auth, forceRefresh]);

    return { user, setForceRefresh };
};
