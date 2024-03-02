import { MerchantTable } from "./merchant.typing";
import { UsageTable } from "./usage.typing";

export interface MerchantUsageTable {
    id: string;
    created_at: string;
    merchant: string;
    usage: string;
    active: boolean;
}

export interface MerchantUsage
    extends Omit<MerchantUsageTable, "merchant" | "usage"> {
    merchant: MerchantTable;
    usage: UsageTable;
}
