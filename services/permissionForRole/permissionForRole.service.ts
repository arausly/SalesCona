import { tables } from "@db/tables.db";
import { PermissionForRole } from "@db/typing/permissionsForRole.typing";
import { supabase } from "@supabase/supabase.browser";

/** find all the permissions a particular staff */
export const findPermissionsByStaffId = async (id: string) =>
    supabase
        .from(tables.permissionsForRoles)
        .select("*, permission(*)")
        .eq("merchant_staff", id)
        .returns<PermissionForRole[]>();
