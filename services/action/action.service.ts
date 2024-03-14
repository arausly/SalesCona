import { tables } from "@db/tables.db";
import { Action } from "@db/typing/action.typing";
import { supabase } from "@supabase/supabase.browser";

export const getAction = async () =>
    await supabase.from(tables.actions).select().returns<Action[]>();
