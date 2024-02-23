import React from "react";

//hooks
import { useBrowserSupabase } from "@lib/supabaseBrowser";

//utils
import { debounce } from "@lib/common.utils";
import {
    getProductCategories,
    searchProductCategories
} from "@services/product_categories/product_categories.service";

//db
import { tables } from "@db/tables.db";

//typing
import { ProductCategory } from "../src/app/dashboard/stores/typing";

export const useGetProductCategories = () => {
    const [categories, setCategories] = React.useState<Array<ProductCategory>>(
        []
    );

    //supabase context
    const { supabase } = useBrowserSupabase();

    React.useEffect(() => {
        (async () => {
            try {
                const { data, error } = await getProductCategories();
                if (!error && data) {
                    setCategories(data as ProductCategory[]);
                }
            } catch (err) {}
        })();
    }, []);

    const search = React.useCallback(
        debounce(async (query: string) => {
            try {
                const { data, error } = await searchProductCategories(query);
                if (!error && data) {
                    setCategories(data as ProductCategory[]);
                }
            } catch (err) {}
        }, 500),
        []
    );

    const createNewProductCategory = React.useCallback(
        async (label: string) => {
            if (!label?.trim()) return;
            try {
                const { error, data } = await supabase
                    .from(tables.product_categories)
                    .insert({ label: label.trim().toLowerCase() })
                    .select();
                if (!error && data) {
                    setCategories((prev) => [
                        ...prev,
                        data[0] as ProductCategory
                    ]);
                    return data[0] as ProductCategory;
                }
            } catch (err) {}
        },
        []
    );

    return {
        productCategories: categories,
        createNewProductCategory,
        searchProductCategories: search
    };
};
