import { MerchantTable } from "./merchant.typing";
import { MerchantStaffTable } from "./merchantStaff.typing";
import { StoreTable } from "./store.typing";

export interface ProductTable {
    id: string;
    slug: string;
    created_at: string;
    name: string;
    description: string;
    inventory_count: number;
    sku_code: string;
    store: string;
    variations: string;
    price: number;
    discount: number;
    has_warranty: boolean;
    warranty_period: "<1" | "1" | "2" | "3" | "4" | "5" | ">5";
    product_images: string;
    is_published: boolean;
    //the staff that created this product, if it was a merchant, then this would be empty
    staff_creator: string;
    //the merchant that created this product, if it was a staff, then this would be empty
    merchant_creator: string;
    support_multiple_currencies: boolean;
}

export interface Product
    extends Omit<ProductTable, "store" | "staff_creator" | "merchant_creator"> {
    store: StoreTable;
    staff_creator: MerchantStaffTable | null | undefined;
    merchant_creator: MerchantTable | null | undefined;
}
