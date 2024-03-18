import { Merchant } from "./merchant.typing";
import { ProductTable } from "./product.typing";
import { StoreTable } from "./store.typing";

export interface MerchantCouponCodeTable {
    id: string;
    created_at: string;
    is_expired: boolean;
    merchant: string;
    store: string;
    discount: number;
    product: string;
    expiration_time: string;
    mode: "one-time" | "periodic";
    code: string;
}

export interface MerchantCouponCode
    extends Omit<MerchantCouponCodeTable, "merchant" | "store" | "product"> {
    merchant: Merchant | null;
    store: StoreTable | null;
    product: ProductTable | null;
}
