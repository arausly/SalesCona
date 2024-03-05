import Usage from "@lib/usages/usage.utils";
import { User } from "@db/typing/merchantStaff.typing";
import { findPermissionsByStaffId } from "@services/actionForRole/actionForRole.service";
import { ActionKeys } from "./typing";
import { ActionForRole } from "@db/typing/actionsForRole.typing";

/* staff.has(permissions.toChangeStoreName) --> bool
   usage.can(usages.createStore) --> bool
   if merchant can't, staff also can't
/** What a merchant staff can do per merchant store */
export default class Permission {
    user: User = null;
    usage: Usage | null = null;
    permissions: ActionForRole[] = [];

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
    private hasPermissionFor = (actionKey: ActionKeys): boolean => {
        if (!this.user?.owner) return true; // as a merchant, you can do all things :)
        //if one of the permissions for
        const permissionFound = this.permissions.some(
            (permission) => permission.action.key === actionKey
        );
        return permissionFound;
    };

    //check both permission and usages privileges to determine if any user can do anything
    has = async (permission: ActionKeys): Promise<boolean> => {
        if (!this.usage) return false;
        switch (permission) {
            case ActionKeys.toChangeStoreName:
                return (
                    this.hasPermissionFor(ActionKeys.toChangeStoreName) &&
                    (await this.usage.has(ActionKeys.toChangeStoreName))
                );
            case ActionKeys.toCreateStore:
                return (
                    this.hasPermissionFor(ActionKeys.toCreateStore) &&
                    (await this.usage.has(ActionKeys.toCreateStore))
                );
            default:
                return false;
        }
    };
}
