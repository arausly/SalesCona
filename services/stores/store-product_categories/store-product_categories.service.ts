import { tables } from "@db/tables.db";
import { supabase } from "../../../supabase/supabase.browser";
import { Store } from "../../../src/app/dashboard/stores/typing";

//store product categories
export const getStoreProductCategories = async ({
    storeId
}: {
    storeId: string;
}) =>
    await supabase
        .from(tables.store_product_categories)
        .select("*,category(*)")
        .eq("store", storeId)
        .returns<Store["categories"]>();
