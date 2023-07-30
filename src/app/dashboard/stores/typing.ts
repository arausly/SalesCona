export interface Product {
    product: string;
    description: string;
    status: "published" | "draft";
    price: string;
    inventoryCount: string;
    viewCount: string;
}

export interface ProductCategory {
    id: number;
    created_at: string;
    label: string;
}

export interface Store {
    id: string;
    created_at: string;
    name: string;
    slug: string;
    description: string;
    shop_logo: string;
    facebook: string;
    instagram: string;
    twitter: string;
    banner: Array<{
        url: string;
    }>;
    currency: string;
    isPublished: boolean;
    categories?: Array<{
        id: number;
        created_at: string;
        category: ProductCategory;
        store: string;
    }>;
}
