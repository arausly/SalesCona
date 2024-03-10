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
     * permissions are segmented per store, a certain user may be able to do
     */
    private hasPermissionFor = (
        actionKey: ActionKeys,
        storeId: string
    ): boolean => {
        if (!this.user?.owner) return true; // as a merchant, you can do all things :)
        //if one of the permissions for
        const permissionFound = this.permissions.some(
            (permission) =>
                permission.action.key === actionKey &&
                storeId === permission.store
        );
        return permissionFound;
    };

    /**
     * check both permission and usages privileges to determine if any user can do anything
     * PayloadType could be store, merchant, user etc
     **/
    has = async <PayloadType>(
        action: ActionKeys,
        payload: PayloadType
    ): Promise<boolean> => {
        if (!this.usage) return false;
        const payloadString = payload as string; // e.g storeId
        switch (action) {
            case ActionKeys.toChangeStoreName:
                return this.hasPermissionFor(
                    ActionKeys.toChangeStoreName,
                    payloadString
                );
            case ActionKeys.toCreateStore:
                return (
                    this.hasPermissionFor(
                        ActionKeys.toCreateStore,
                        payloadString
                    ) &&
                    (await this.usage.has(
                        ActionKeys.toCreateStore,
                        payloadString
                    ))
                );
            case ActionKeys.toAddNewProduct:
            // return this.hasPermissionFor(ActionKeys.)
            default:
                return false;
        }
    };
}
