import { tables } from "@db/tables.db";
import { ProductTable } from "@db/typing/product.typing";
import { supabase } from "@supabase/supabase.browser";

/**
 * Get all the products for the store
 * @param storeId
 */
export const getProductsForStore = async (storeId: string) =>
    await supabase
        .from(tables.products)
        .select()
        .eq("store", storeId)
        .returns<ProductTable[]>();
