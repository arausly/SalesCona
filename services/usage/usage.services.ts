import { tables } from "@db/tables.db";
import {
    MerchantUsage,
    MerchantUsagePopulatedAction
} from "@db/typing/merchantUsage.typing";
import { ActionKeys } from "@lib/permissions/typing";
import { supabase } from "@supabase/supabase.browser";

/** get all the merchant usages */
export const getMerchantUsages = async (merchantId?: string) => {
    if (!merchantId) return [];
    const { data, error } = await supabase
        .from(tables.merchantUsages)
        .select("*,usage(*, associated_action(*))")
        .eq("merchant", merchantId)
        .returns<MerchantUsagePopulatedAction[]>();
    return !error && data ? data : [];
};

export type UsageAggregate = {
    [key in ActionKeys]: {
        level: number;
        privilege: string;
    };
};

export const transformMerchantUsages = (
    merchantUsages: MerchantUsagePopulatedAction[]
) => {
    return merchantUsages.reduce((aggregate, merchantUsage) => {
        const newEntry = () => {
            aggregate[aggregateKey] = {
                level: merchantUsage.usage.level,
                privilege: merchantUsage.usage.name
            };
        };
        const aggregateKey = merchantUsage.usage.associated_action.key;
        if (!merchantUsage.active) return aggregate;

        if (
            aggregate[aggregateKey] &&
            aggregate[aggregateKey].level < merchantUsage.usage.level
        ) {
            newEntry();
        } else {
            if (!aggregate[aggregateKey]) {
                newEntry();
            }
        }
        return aggregate;
    }, {} as UsageAggregate);
};
