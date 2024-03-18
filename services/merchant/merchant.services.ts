import { tables } from "@db/tables.db";
import { Merchant } from "@db/typing/merchant.typing";
import { supabase } from "@supabase/supabase.browser";

/** update merchant  */
export const updateMerchant = async (
    merchantId: string,
    update: Partial<Merchant>
) =>
    await supabase
        .from(tables.merchants)
        .update({ ...update })
        .eq("id", merchantId);

export const getMerchantByAuthId = async (authId: string) =>
    await supabase
        .from(tables.merchants)
        .select()
        .eq("auth_id", authId)
        .returns<Merchant[]>();
