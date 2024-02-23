import { tables } from "@db/tables.db";
import { supabase } from "../../supabase/supabase.browser";

/**
 * Product categories for the entire application e.g electronics, furniture
 */
export const getProductCategories = async () =>
    await supabase.from(tables.product_categories).select();

// search for product category
export const searchProductCategories = async (query: string) =>
    await supabase
        .from(tables.product_categories)
        .select()
        .ilike("label", `%${query}%`);
