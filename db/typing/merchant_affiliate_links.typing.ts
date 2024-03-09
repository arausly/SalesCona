import { ProductTable } from "./product.typing";
import { StoreTable } from "./store.typing";

export interface MerchantAffiliateLinkTable {
    id: string;
    created_at: string;
    product: string;
    store: string;
    title: string;
    commission: number;
    link: string;
}

export interface MerchantAffiliate
    extends Omit<MerchantAffiliateLinkTable, "product" | "store"> {
    product: ProductTable | null;
    store: StoreTable | null;
}
