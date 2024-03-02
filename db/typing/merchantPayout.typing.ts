import { MerchantTable } from "./merchant.typing";

/** this is merchant's payout config,
 * whether they would like to receive their money after a while*/
export interface MerchantPayoutTable {
    id: string;
    created_at: string;
    merchant: string;
    is_daily: boolean;
    is_weekly: boolean;
    is_monthly: boolean;
}

export interface MerchantPayout extends Omit<MerchantPayoutTable, "merchant"> {
    merchant: MerchantTable;
}
