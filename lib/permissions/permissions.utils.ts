import Usage from "@lib/usages/usage.utils";
import { permissions } from "./typing";

/* staff.has(permissions.toChangeStoreName) --> bool
   usage.can(usages.createStore) --> bool
   if merchant can't, staff also can't
/** What a merchant staff can do per merchant store */
export default class StaffPermission {
    staff = null;
    usage: Usage | null = null;

    constructor(staff: any) {
        this.staff = staff;
        this.usage = new Usage(staff.owner);
    }

    //check if merchant staff role
    private getRole = () => {};

    /**
     * checks if this staff can change store name
     */
    private canChangeStoreName = (): boolean => {
        //if one of the permissions for
        return false;
    };

    has = (permission: permissions): boolean => {
        switch (permission) {
            case permissions.toChangeStoreName:
                return this.canChangeStoreName();
            default:
                return false;
        }
    };
}
