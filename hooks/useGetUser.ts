"use client";
import React from "react";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { User } from "@supabase/supabase-js";
import { storageKeys } from "@lib/constants";

export const useGetUser = () => {
    const [user, setUser] = React.useState<User | null>();
    const { supabase } = useBrowserSupabase();

    React.useEffect(() => {
        (async () => {
            if (process.browser) {
                const storedUser = localStorage.getItem(storageKeys.user);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    const {
                        data: { user: userInfo }
                    } = await supabase.auth.getUser();
                    localStorage.setItem(
                        storageKeys.user,
                        JSON.stringify(userInfo)
                    );
                    setUser(userInfo);
                }
            }
        })();
    }, [supabase.auth]);

    return user;
};
