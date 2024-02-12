export interface SubscriptionTable {
    id: string;
    created_at: string;
    category: string;
    name: string;
    price: number;
    is_monthly: boolean;
    active: boolean;
}

export interface SubscriptionCategoryTable {
    id: string;
    created_at: string;
    name: string;
}

export interface SubscriptionPopulatedWithCategoryInfo
    extends Omit<SubscriptionTable, "category"> {
    category: SubscriptionCategoryTable;
}
