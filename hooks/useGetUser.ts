import React from "react";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { User } from "@supabase/supabase-js";

export const useGetUser = () => {
    const [user, setUser] = React.useState<User | null>(null);
    const { supabase } = useBrowserSupabase();

    React.useEffect(() => {
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        })();
    }, [supabase.auth]);

    return user;
};
