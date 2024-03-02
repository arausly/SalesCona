import { UsageCategory } from "./usageCategories.typing";

export interface UsageTable {
    id: string;
    created_at: string;
    category: string;
    name: string;
    price_naira: string;
    price_usd: string;
    is_free: string;
}

export interface Usage extends Omit<UsageTable, "category"> {
    category: UsageCategory;
}
