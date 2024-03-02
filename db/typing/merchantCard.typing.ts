import { MerchantTable } from "./merchant.typing";

export interface MerchantCardTable {
    id: string;
    created_at: string;
    merchant: string;
    last4: string;
    /** used for recurring charges */
    authorization_code: string;
    exp_year: string;
    card_type: string;
    active: string;
    bank: string;
}

export interface MerchantCard extends Omit<MerchantCardTable, "merchant"> {
    merchant: MerchantTable;
}
