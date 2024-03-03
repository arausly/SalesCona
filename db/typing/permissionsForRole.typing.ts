import { MerchantStaffTable } from "./merchantStaff.typing";
import { Permission } from "./permission.typing";
import { RoleTable } from "./role.typing";

export interface PermissionForRoleTable {
    id: string;
    created_at: string;
    role: string;
    permission: string;
    merchant_staff: string;
}

export interface PermissionForRole
    extends Omit<
        PermissionForRoleTable,
        "role" | "permission" | "merchant_staff"
    > {
    role: RoleTable;
    permission: Permission;
    merchantStaff: MerchantStaffTable;
}
