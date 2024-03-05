import { tables } from "@db/tables.db";
import { ActionForRole } from "@db/typing/actionsForRole.typing";
import { supabase } from "@supabase/supabase.browser";

/** find all the permissions a particular staff */
export const findPermissionsByStaffId = async (id: string) =>
    supabase
        .from(tables.actionsForRoles)
        .select("*, permission(*)")
        .eq("merchant_staff", id)
        .returns<ActionForRole[]>();
