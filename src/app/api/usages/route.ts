import { tables } from "@db/tables.db";
import { UsageTable } from "@db/typing/usage.typing";
import { supabaseServer } from "@lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const payload = await request.json();
    const supabase = await supabaseServer();

    if (!payload || !(payload.merchant && payload.store))
        return NextResponse.json({
            status: 400,
            msg: "Missing required parameters"
        });

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
            if (!usageError) return NextResponse.json({ status: 200 });

            return NextResponse.json({
                status: 500,
                msg: "something went wrong"
            });
        }
    } catch (err) {
        return NextResponse.json({ status: 500, msg: "something went wrong" });
    }
}
