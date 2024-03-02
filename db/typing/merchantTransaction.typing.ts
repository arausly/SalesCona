/**
 * transactions from customers could be a credit or a refund,
 * also transaction with us, which is usually a payout.
 *
 * This is different merchant's billing which refer to charges for usages
 **/

import { MerchantTable } from "./merchant.typing";

export interface MerchantTransactionTable {
    id: string;
    created_at: string;
    merchant: string;
    amount: number;
    status: "credit" | "payout" | "refund";
}

export interface MerchantTransaction
    extends Omit<MerchantTransactionTable, "merchant"> {
    merchant: MerchantTable;
}
