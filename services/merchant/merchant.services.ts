import { tables } from "@db/tables.db";
import { Merchant } from "@db/typing/merchant.typing";
import { User } from "@db/typing/merchantStaff.typing";
import { updateStaff } from "@services/staff/staff.service";
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

//update if a staff or merchant
export const updateUser = (user: User) =>
    user?.user_metadata?.merchant ? updateMerchant : updateStaff;
