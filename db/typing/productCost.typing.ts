import { Product } from "./product.typing";

export interface ProductCostsTable {
    id: string;
    created_at: string;
    amount: string;
    currency_symbol: string;
    currency_name: string;
    product: string;
}

export interface ProductCosts extends Omit<ProductCostsTable, "product"> {
    product: Product;
}
