import React from "react";

import { supabaseTables } from "@lib/constants";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { ProductCategory, Store } from "../typing";
import { useGetUser } from "@hooks/useGetUser";

interface StoreBySlug extends Omit<Store, "categories"> {
    categories: Array<{
        id: number;
        created_at: string;
        category: ProductCategory;
        label: string;
        store: string;
    }>;
}

export const useGetStoreBySlug = (slug: string) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const { supabase } = useBrowserSupabase();
    const [store, setStore] = React.useState<StoreBySlug>();
    const user = useGetUser();

    React.useEffect(() => {
        (async () => {
            if (slug && user) {
                setLoading(true);
                try {
                    const { data, error } = await supabase
                        .from(supabaseTables.stores)
                        .select()
                        .eq("slug", slug)
                        .eq("user_id", user.id)
                        .returns<Store[]>();

                    if (data?.length && !error) {
                        // data[0].
                        const { data: categories, error: err } = await supabase
                            .from(supabaseTables.store_product_categories)
                            .select("*,category(*)")
                            .eq("store", data[0].id)
                            .returns<Store["categories"]>();

                        if (categories?.length && !err) {
                            data[0].categories = categories.map((c) => ({
                                ...c,
                                label: c.category.label
                            }));
                            setStore(data[0] as StoreBySlug);
                        }
                    }
                } catch (err) {
                } finally {
                    setLoading(false);
                }
            }
        })();
    }, [slug, user]);

    return { loading, store };
};
