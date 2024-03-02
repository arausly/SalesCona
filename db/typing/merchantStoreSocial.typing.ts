import { MerchantTable } from "./merchant.typing";
import { StoreTable } from "./store.typing";

export interface MerchantStoreSocialTable {
    id: string;
    created_at: string;
    social_link: string;
    merchant: string;
    store: string;
    is_primary: boolean;
}

export interface MerchantStoreSocial
    extends Omit<MerchantStoreSocialTable, "merchant" | "store"> {
    merchant: MerchantTable;
    store: StoreTable;
}
