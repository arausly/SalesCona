import { Action } from "./action.typing";
import { UsageCategory } from "./usageCategory.typing";

export interface UsageTable {
    id: string;
    created_at: string;
    category: string;
    name: string;
    price_naira: number;
    price_usd: number;
    is_free: string;
    associated_action: string;
    //defines the hierarchy of usage privileges.
    level: number;
}

export interface Usage
    extends Omit<UsageTable, "category" | "associated_action"> {
    category: UsageCategory;
    associated_action: Action;
}
