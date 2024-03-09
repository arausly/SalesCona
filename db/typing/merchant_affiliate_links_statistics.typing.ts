import { MerchantAffiliateLinkTable } from "./merchant_affiliate_links.typing";

export interface MerchantAffiliateStatisticsTable {
    id: string;
    created_at: string;
    affiliate_link: string;
    visitor_country: string;
    purchases_count: number;
    total_value: number;
    visitor_ip: string;
    total_visits: number;
}

export interface MerchantAffiliateStatistics
    extends Omit<MerchantAffiliateStatisticsTable, "affiliate_link"> {
    affiliate_link: MerchantAffiliateLinkTable;
}
