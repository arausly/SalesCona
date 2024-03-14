import { tableType } from "@db/tables.db";
import {
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
    RealtimeChannel,
    RealtimePostgresInsertPayload
} from "@supabase/supabase-js";
import { supabase } from "@supabase/supabase.browser";

export const listenToChangesIn = (
    table: tableType,
    event: any, //todo fix later, should use appropriate types
    cb: (payload: any) => void
): RealtimeChannel => {
    return supabase
        .channel(table)
        .on(
            "postgres_changes",
            {
                event: event,
                schema: "public",
                table
            },
            async (payload) => {
                await cb(payload);
            }
        )
        .subscribe();
};
