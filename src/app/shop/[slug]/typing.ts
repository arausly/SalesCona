export interface CustomerProduct {
    product: string;
    description: string;
    price: string;
    inventoryCount: string;
    viewCount: string;
    discount?: number;
    variants?: string[];
    urlPath?: string;
}
