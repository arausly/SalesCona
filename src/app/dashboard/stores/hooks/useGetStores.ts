import React from "react";

//hooks
import { useGetUser } from "@hooks/useGetUser";

//utils
import { debounce } from "@lib/common.utils";

//services
import { getStores, searchStores } from "@services/stores/stores.service";
import { getStoreProductCategories } from "@services/stores/store-product_categories/store-product_categories.service";

//typing
import { Store } from "../typing";

export const useGetStores = () => {
    const { user } = useGetUser();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [stores, setStores] = React.useState<Store[]>([]);
    const [refreshCounter, setRefresh] = React.useState<number>(0);

    React.useEffect(() => {
        (async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data, error } = await getStores(user.id);

                if (!error && data) {
                    await populateWithCategories(data as Store[]);
                    setStores(data as Store[]);
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        })();
    }, [user, refreshCounter]);

    const refreshStores = React.useCallback(() => setRefresh((r) => ++r), []);

    const search = React.useCallback(
        debounce(async (query: string) => {
            try {
                if (!user) return;
                setLoading(true);
                const { data, error } = await searchStores({
                    query,
                    merchantId: user.id
                }); //todo change to merchant id

                if (!error && data) {
                    await populateWithCategories(data as Store[]);
                    setStores(data as Store[]);
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
                        const { data: storeCategories, error } =
                            await getStoreProductCategories({
                                storeId: store.id
                            });

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

    return {
        stores,
        storeLoading: loading,
        searchStores: search,
        refreshStores
    };
};
