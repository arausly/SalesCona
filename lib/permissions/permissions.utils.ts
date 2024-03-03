import Usage from "@lib/usages/usage.utils";
import { actions } from "./typing";
import { User } from "@db/typing/merchantStaff.typing";
import { findPermissionsByStaffId } from "@services/permissionForRole/permissionForRole.service";
import { PermissionForRole } from "@db/typing/permissionsForRole.typing";

/* staff.has(permissions.toChangeStoreName) --> bool
   usage.can(usages.createStore) --> bool
   if merchant can't, staff also can't
/** What a merchant staff can do per merchant store */
export default class Permission {
    user: User = null;
    usage: Usage | null = null;
    permissions: PermissionForRole[] = [];

    constructor(user: User) {
        this.user = user;
        this.usage = new Usage(user);

        //get the permissions for this staff
        this.getPermissions(user).then((authPermissions) => {
            this.permissions = authPermissions ?? [];
        });
    }

    //check if merchant staff role
    private getPermissions = async (staff: User) => {
        if (!staff) return;
        try {
            const { data: authorizedPermissions, error } =
                await findPermissionsByStaffId(staff.id);

            return !error && authorizedPermissions ? authorizedPermissions : [];
        } catch (err) {}
    };

    /**
     * checks if this staff can perform the said action in argument
     */
    private hasPermissionFor = (action: actions): boolean => {
        if (!this.user?.owner) return true; // as a merchant, you can do all things :)
        //if one of the permissions for
        const permissionFound = this.permissions.some(
            (permission) => permission.permission.action === action
        );
        return permissionFound;
    };

    //check both permission and usages privileges to determine if any user can do anything
    has = (permission: actions): boolean => {
        switch (permission) {
            case actions.toChangeStoreName:
                return this.hasPermissionFor(actions.toChangeStoreName);
            default:
                return false;
        }
    };
}
