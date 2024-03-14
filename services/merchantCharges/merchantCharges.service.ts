import { tables } from "@db/tables.db";
import { MerchantChargeTable } from "@db/typing/merchantCharge.typing";
import { supabase } from "@supabase/supabase.browser";

export const getMerchantCharges = async (merchantId: string) =>
    await supabase
        .from(tables.merchantCharges)
        .select()
        .eq("merchant", merchantId)
        .returns<MerchantChargeTable[]>();
