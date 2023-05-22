export interface Product {
    product: string;
    description: string;
    status: "Published" | "Draft";
    price: string;
    inventoryCount: string;
    viewCount: string;
}
