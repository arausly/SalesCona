export interface Product {
    product: string;
    description: string;
    status: "published" | "draft";
    price: string;
    inventoryCount: string;
    viewCount: string;
}
