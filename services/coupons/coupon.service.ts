import { tables } from "@db/tables.db";
import { MerchantCouponCodeTable } from "@db/typing/merchantCouponCode.typing";
import { supabase } from "@supabase/supabase.browser";

export const getCouponsForStoreQuery = (storeId: string) =>
    supabase.from(tables.merchantCouponCodes).select().eq("store", storeId);

export const getCouponsForStoreSinceTimeAgo = async (
    storeId: string,
    days: number
) => {
    const query = getCouponsForStoreQuery(storeId);

    // Get current date
    const currentDate = new Date();

    // Calculate date 30 days ago
    const daysAgo = new Date();
    daysAgo.setDate(currentDate.getDate() - days);

    // Format the date to ISO 8601 format
    const daysAgoISO = daysAgo.toISOString();

    return await query
        .gte("created_at", daysAgoISO)
        .returns<MerchantCouponCodeTable[]>();
};
