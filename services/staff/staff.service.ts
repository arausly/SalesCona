import { tables } from "@db/tables.db";
import {
    MerchantStaff,
    MerchantStaffRolePopulated,
    MerchantStaffTable
} from "@db/typing/merchantStaff.typing";
import { supabase } from "@supabase/supabase.browser";

export const getStaffsForStore = async (storeId: string, merchant: string) =>
    await supabase
        .from(tables.merchantStaffs)
        .select()
        .eq("store", storeId)
        .eq("owner", merchant)
        .returns<MerchantStaffTable[]>();

export const getStaffsForMerchant = async (merchantId: string) =>
    (
        await supabase
            .from(tables.merchantStaffs)
            .select("*,role(*)")
            .eq("owner", merchantId)
            .returns<MerchantStaffRolePopulated[]>()
    ).data ?? [];

//update one staff
export const updateStaff = async (
    staffId: string,
    payload: Partial<MerchantStaffTable>
) =>
    await supabase
        .from(tables.merchantStaffs)
        .update(payload)
        .eq("id", staffId);

export type StoreStaffCategory = {
    [storeId: string]: MerchantStaffRolePopulated[];
};

export const categorizeMerchantStaffPerStore = (
    staffs: MerchantStaffRolePopulated[]
) => {
    return staffs.reduce((aggregate, staff) => {
        if (aggregate[staff.store]) {
            aggregate[staff.store].push(staff);
        } else {
            aggregate[staff.store] = [staff];
        }
        return aggregate;
    }, {} as StoreStaffCategory);
};
