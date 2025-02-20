import { Merchant } from "./merchant.typing";
import { StoreTable } from "./store.typing";
import { Usage, UsageTable } from "./usage.typing";

export interface MerchantUsageTable {
    id: string;
    created_at: string;
    merchant: string;
    usage: string;
    active: boolean;
    store: string;
}

export interface MerchantUsage
    extends Omit<MerchantUsageTable, "merchant" | "usage" | "store"> {
    merchant: Merchant;
    usage: UsageTable;
    store: StoreTable;
}

export interface MerchantUsagePopulatedAction
    extends Omit<MerchantUsage, "usage" | "store"> {
    usage: Usage;
    store: string;
}
