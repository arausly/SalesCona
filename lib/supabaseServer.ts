import {
    createBrowserSupabaseClient,
    createServerComponentSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";

export const supabaseServer = createServerComponentSupabaseClient({
    headers,
    cookies,
});
