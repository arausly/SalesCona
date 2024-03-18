import { tables } from "@db/tables.db";
import { getAllFreeAppUsages } from "@services/usage/usage.services";
import { supabase } from "@supabase/supabase.browser";

/**
 * When a user is created he is allowed certain privileges out of the box
 */
export const initialDefaultUsages = async (merchant: string, store: string) => {
    try {
        const { data: freeUsages, error } = await getAllFreeAppUsages();

        if (freeUsages && !error) {
            await supabase.from(tables.merchantUsages).insert(
                freeUsages.map((usage) => ({
                    merchant,
                    store,
                    active: true,
                    usage: usage.id
                }))
            );
        }
    } catch (err) {}
};
