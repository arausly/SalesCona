import { Merchant, MerchantTable } from "./merchant.typing";
import { Role } from "./role.typing";
import { StoreTable } from "./store.typing";

export interface MerchantStaffTable extends MerchantTable {
    owner: string;
    auth_id: string;
    last_active: string;
    role: string;
    suspended: boolean;
    is_deleted: boolean;
    firstname: string;
    lastname: string;
    id: string;
    country: string;
    /**@private method not to be accessed, sensitive information only used when absolutely necessary */
    lng_lat: string;
    store: string;
}

export interface MerchantStaff
    extends Omit<MerchantStaffTable, "role" | "owner" | "store"> {
    owner: Merchant;
    role: Role;
    store: StoreTable;
}

export type User = (Merchant & MerchantStaff) | null | undefined;
