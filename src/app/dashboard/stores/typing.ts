export interface ProductCategory {
    id: number;
    created_at: string;
    label: string;
}

export interface Store {
    id: number;
    created_at: string;
    name: string;
    slug: string;
    description: string;
    shop_logo: string;
    facebook: string;
    instagram: string;
    twitter: string;
    banners: string;
    currency: string;
    isPublished: boolean;
    secondary_key: string;
    categories?: Array<{
        id: number;
        created_at: string;
        category: ProductCategory;
        store: string;
    }>;
}

type ProductSellingType = "online" | "in-store" | "both";
type WarrantyPeriod = "<1" | "1" | "2" | "3" | "4" | "5" | ">5";
export interface Product {
    name: string;
    description: string;
    inventory_count: number;
    sku_code?: string;
    store: Store;
    selling_type: ProductSellingType;
    variations: {
        [variationName: string]: string[];
    }[];
    pricing: number;
    discount: number;
    delivery_charge?: number;
    delivery_location_restriction?: string;
    pickup_store_address?: string;
    has_warranty: boolean;
    categories: string;
    warranty_period: WarrantyPeriod;
    product_images: string[];
}
