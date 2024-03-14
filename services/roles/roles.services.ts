import { tables } from "@db/tables.db";
import { RoleTable } from "@db/typing/role.typing";
import { supabase } from "@supabase/supabase.browser";

export const getRoles = async (merchant_staff: string) =>
    await supabase
        .from(tables.roles)
        .select()
        .eq("merchant_staff", merchant_staff)
        .returns<RoleTable[]>();

export const getRoleById = async (id: string) =>
    await supabase
        .from(tables.roles)
        .select()
        .eq("id", id)
        .returns<RoleTable[]>();
