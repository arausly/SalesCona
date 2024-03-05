import { Action } from "./action.typing";
import { MerchantStaffTable } from "./merchantStaff.typing";
import { RoleTable } from "./role.typing";

export interface ActionForRoleTable {
    id: string;
    created_at: string;
    role: string;
    action: string;
    merchant_staff: string;
}

export interface ActionForRole
    extends Omit<ActionForRoleTable, "role" | "action" | "merchant_staff"> {
    role: RoleTable;
    action: Action;
    merchantStaff: MerchantStaffTable;
}
