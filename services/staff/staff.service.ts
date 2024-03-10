import { tables } from "@db/tables.db";
import { MerchantStaffTable } from "@db/typing/merchantStaff.typing";
import { supabase } from "@supabase/supabase.browser";

export const getStaffsForStore = async (storeId: string, merchant: string) =>
    await supabase
        .from(tables.merchantStaffs)
        .select()
        .eq("store", storeId)
        .eq("owner", merchant)
        .returns<MerchantStaffTable[]>();
