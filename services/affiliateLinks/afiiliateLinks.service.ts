import { tables } from "@db/tables.db";
import { MerchantAffiliateLinkTable } from "@db/typing/merchant_affiliate_links.typing";
import { supabase } from "@supabase/supabase.browser";

export const getAffiliateLinksForStoreQuery = (storeId: string) =>
    supabase.from(tables.merchantAffiliateLinks).select().eq("store", storeId);

export const getAffiliateLinksForStoreSinceTimeAgo = async (
    storeId: string,
    days: number
) => {
    const query = getAffiliateLinksForStoreQuery(storeId);

    // Get current date
    const currentDate = new Date();

    // Calculate date 30 days ago
    const daysAgo = new Date();
    daysAgo.setDate(currentDate.getDate() - days);

    // Format the date to ISO 8601 format
    const daysAgoISO = daysAgo.toISOString();

    return await query
        .gte("created_at", daysAgoISO)
        .returns<MerchantAffiliateLinkTable[]>();
};
