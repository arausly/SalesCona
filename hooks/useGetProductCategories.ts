import React from "react";
import { ProductCategory } from "../src/app/dashboard/stores/typing";
import { supabaseTables } from "@lib/constants";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { debounce } from "@lib/common.utils";

export const useGetProductCategories = () => {
    const [categories, setCategories] = React.useState<Array<ProductCategory>>(
        []
    );

    //supabase context
    const { supabase } = useBrowserSupabase();

    React.useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase
                    .from(supabaseTables.product_categories)
                    .select();
                if (!error && data) {
                    setCategories(data as ProductCategory[]);
                }
            } catch (err) {}
        })();
    }, []);

    const searchProductCategories = React.useCallback(
        debounce(async (query: string) => {
            try {
                const { data, error } = await supabase
                    .from(supabaseTables.product_categories)
                    .select()
                    .ilike("label", `%${query}%`);

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
                    .from(supabaseTables.product_categories)
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
        searchProductCategories
    };
};
