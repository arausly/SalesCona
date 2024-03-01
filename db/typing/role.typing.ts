import { MerchantStaffTable } from "./merchantStaff.typing";

export interface RoleTable {
    label: string;
    store: string;
    merchant_staff: string;
    id: string;
    created_at: string;
}

export interface Role extends Omit<RoleTable, "merchant_staff" | "store"> {
    merchant_staff: MerchantStaffTable;
}
