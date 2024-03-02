import { MerchantTable } from "./merchant.typing";

export interface MerchantChargeTable {
    id: string;
    created_at: string;
    amount: number;
    next_billing_date: string;
    is_cancelled: string;
    merchant: string;
}

export interface MerchantCharge extends Omit<MerchantChargeTable, "merchant"> {
    merchant: MerchantTable;
}
