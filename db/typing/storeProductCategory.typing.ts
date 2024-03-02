import { ProductCategory } from "./productCategory.typing";
import { StoreTable } from "./store.typing";

export interface StoreProductCategoryTable {
    id: string;
    created_at: string;
    category: string;
    store: string;
}

export interface StoreProductCategory
    extends Omit<StoreProductCategoryTable, "store" | "category"> {
    category: ProductCategory;
    store: StoreTable;
}
