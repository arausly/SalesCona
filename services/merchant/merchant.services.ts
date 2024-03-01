import { tables } from "@db/tables.db";
import { MerchantTable } from "@db/typing/merchant.typing";
import { supabase } from "@supabase/supabase.browser";

/** update merchant  */
export const updateMerchant = async (
    merchantId: string,
    update: Partial<MerchantTable>
) =>
    await supabase
        .from(tables.merchants)
        .update({ ...update })
        .eq("id", merchantId);
