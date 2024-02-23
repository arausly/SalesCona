import React from "react";

//hooks
import { useGetUser } from "@hooks/useGetUser";

//services
import { getStoreBySlug } from "@services/stores/stores.service";
import { getStoreProductCategories } from "@services/stores/store-product_categories/store-product_categories.service";

//typing
import { ProductCategory, Store } from "../typing";

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
    const [store, setStore] = React.useState<StoreBySlug>();
    const { user } = useGetUser();

    React.useEffect(() => {
        (async () => {
            if (slug && user) {
                setLoading(true);
                try {
                    const { data, error } = await getStoreBySlug({
                        slug,
                        userId: user.id
                    });

                    if (data?.length && !error) {
                        // data[0].
                        const { data: categories, error: err } =
                            await getStoreProductCategories({
                                storeId: data[0].id
                            });

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
