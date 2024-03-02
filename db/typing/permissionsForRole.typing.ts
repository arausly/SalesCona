import { Permission } from "./permission.typing";
import { RoleTable } from "./role.typing";

export interface PermissionForRoleTable {
    id: string;
    created_at: string;
    role: string;
    permission: string;
}

export interface PermissionForRole
    extends Omit<PermissionForRoleTable, "role" | "permission"> {
    role: RoleTable;
    permission: Permission;
}
