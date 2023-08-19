import React from "react";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { useGetUser } from "../../../../../hooks/useGetUser";
import { supabaseTables } from "@lib/constants";
import { Store } from "../typing";
import { debounce } from "@lib/common.utils";

export const useGetStores = () => {
    const user = useGetUser();
    const { supabase } = useBrowserSupabase();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [stores, setStores] = React.useState<Store[]>([]);
    const [refreshCounter, setRefresh] = React.useState<number>(0);

    React.useEffect(() => {
        (async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from(supabaseTables.stores)
                    .select()
                    .eq("user_id", user.id)
                    .eq("is_soft_deleted", false);

                if (!error && data) {
                    setStores(data as Store[]);
                    await populateWithCategories(data as Store[]);
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        })();
    }, [user, refreshCounter]);

    const refreshStores = React.useCallback(() => setRefresh((r) => ++r), []);

    const searchStores = React.useCallback(
        debounce(async (query: string) => {
            try {
                if (!user) return;
                setLoading(true);
                const { data, error } = await supabase
                    .from(supabaseTables.stores)
                    .select()
                    .eq("user_id", user.id)
                    .eq("is_soft_deleted", false)
                    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

                if (!error && data) {
                    setStores(data as Store[]);
                    await populateWithCategories(data as Store[]);
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        }, 500),
        [user]
    );

    const populateWithCategories = React.useCallback(
        async (stores: Store[]) => {
            try {
                await Promise.all(
                    stores.map(async (store) => {
                        const { data: storeCategories, error } = await supabase
                            .from(supabaseTables.store_product_categories)
                            .select("category(*)")
                            .eq("store", store.id);

                        if (storeCategories?.length && !error) {
                            store.categories =
                                storeCategories as Store["categories"];
                        }
                    })
                );
            } catch (err) {}
        },
        []
    );

    return { stores, storeLoading: loading, searchStores, refreshStores };
};
