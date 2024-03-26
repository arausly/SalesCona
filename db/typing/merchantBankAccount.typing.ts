import { Merchant } from "./merchant.typing";

export interface MerchantBankAccountTable {
    id: string;
    created_at: string;
    account_name: string;
    bank_name: string;
    bank_code: string;
    account_number: string;
    merchant: string;
    store: string;
    logo: string;
    is_daily: boolean;
    is_weekly: boolean;
    is_monthly: boolean;
    country: string;
}

export interface MerchantBankAccount
    extends Omit<MerchantBankAccountTable, "merchant"> {
    merchant: Merchant;
}
