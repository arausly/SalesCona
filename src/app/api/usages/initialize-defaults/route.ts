import { tables } from "@db/tables.db";
import { UsageTable } from "@db/typing/usage.typing";
import { ErrorResponse, SuccessResponse } from "@lib/route-utils";
import { supabaseServer } from "@lib/supabaseServer";

export async function POST(request: Request) {
    const payload = await request.json();
    const supabase = await supabaseServer();

    if (!payload || !(payload.merchant && payload.store))
        return ErrorResponse.badRequest();

    try {
        const { data: freeUsages, error } = await supabase
            .from(tables.usages)
            .select()
            .eq("is_free", true)
            .returns<UsageTable[]>();

        if (freeUsages && !error) {
            const { error: usageError } = await supabase
                .from(tables.merchantUsages)
                .insert(
                    freeUsages.map((usage) => ({
                        merchant: payload.merchant,
                        store: payload.store,
                        active: true,
                        usage: usage.id
                    }))
                );
            if (!usageError) return SuccessResponse.ok();

            return ErrorResponse.internalServerError();
        }
    } catch (err) {
        return ErrorResponse.internalServerError();
    }
}
