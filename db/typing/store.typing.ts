import { Merchant } from "./merchant.typing";

export interface StoreTable {
    id: string;
    created_at: string;
    name: string;
    slug: string;
    description: string;
    shop_logo: string;
    currency_name: string;
    currency_symbol: string;
    is_published: boolean;
    is_soft_deleted: boolean;
    social: string;
    merchant: string;
    selling_type: "online" | "in-store" | "both";
    delivery_location_restriction: string;
    pickup_store_address: string;
    general_discount: number;
    subdomain: string;
    next_billing_date: string;
    next_billing_amount_usd: number;
    next_billing_amount_naira: number;
    usage_start_date: string;
    total_privileges: number;
}

export interface Store extends Omit<StoreTable, "merchant"> {
    merchant: Merchant;
}
