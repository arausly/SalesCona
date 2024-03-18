import { Merchant } from "./merchant.typing";

export interface MerchantBillingTable {
    id: string;
    created_at: string;
    reference: string;
    amount: number;
    merchant: string;
}

export interface MerchantBilling
    extends Omit<MerchantBillingTable, "merchant"> {
    merchant: Merchant;
}
