import { tables } from "@db/tables.db";
import {
    MerchantUsage,
    MerchantUsagePopulatedAction
} from "@db/typing/merchantUsage.typing";
import { Usage, UsageTable } from "@db/typing/usage.typing";
import { ActionKeys } from "@lib/permissions/typing";
import { supabase } from "@supabase/supabase.browser";

//get all usages for this app
export const getAppUsages = async () =>
    (
        await supabase
            .from(tables.usages)
            .select("*,category(*)")
            .returns<Usage[]>()
    ).data ?? [];

/** get all the merchant usages */
export const getMerchantUsages = async (merchantId?: string) => {
    if (!merchantId) return [];
    const { data, error } = await supabase
        .from(tables.merchantUsages)
        .select("*,usage(*,category(*),associated_action(*))")
        .eq("merchant", merchantId)
        .returns<MerchantUsagePopulatedAction[]>();
    return !error && data ? data : [];
};

export const getAllFreeAppUsages = async () =>
    await supabase
        .from(tables.usages)
        .select()
        .eq("is_free", true)
        .returns<UsageTable[]>();

//usages per store
export type UsageAggregate = {
    [category: string]: {
        [key in ActionKeys]: {
            level: number;
            privilege: string;
        };
    };
};

//transformers
export const transformMerchantUsages = (
    merchantUsages: MerchantUsagePopulatedAction[]
) => {
    return merchantUsages.reduce((aggregate, merchantUsage) => {
        const aggregateKey = merchantUsage.usage.associated_action.key;
        const category = merchantUsage.store ?? "store";
        const newEntry = () => {
            aggregate[category][aggregateKey] = {
                level: merchantUsage.usage.level,
                privilege: merchantUsage.usage.name
            };
        };
        if (!merchantUsage.active) return aggregate;

        if (
            aggregate[category][aggregateKey] &&
            aggregate[category][aggregateKey].level < merchantUsage.usage.level
        ) {
            newEntry();
        } else {
            //to prevent overwriting by lesser only if non existence
            if (!aggregate[category][aggregateKey]) {
                newEntry();
            }
        }
        return aggregate;
    }, {} as UsageAggregate);
};

export type UsageCategoryType = {
    [key: string]: Usage[];
};

//organize the usages into categories
export const transformUsagesToUsageCategories = (
    usages: Usage[]
): UsageCategoryType => {
    return usages.reduce((categories, usage) => {
        const usageCategory = usage.category.name;
        if (categories[usageCategory]) {
            categories[usageCategory].push(usage);
        } else {
            categories[usageCategory] = [usage];
        }
        return categories;
    }, {} as UsageCategoryType);
};

export interface MerchantUsagesByStoreCategory {
    [storeIdOrKey: string]: {
        [key: string]: (Usage & { active: boolean })[];
    };
}

export const transformToMerchantStoreUsageCategory = (
    merchantUsages: MerchantUsagePopulatedAction[]
) =>
    merchantUsages.reduce((acc, entry) => {
        const storeId = entry.store ?? "store"; //some usages are above store level
        const category = entry.usage.category.name;
        const usage = { ...entry.usage, active: entry.active };
        if (acc[storeId]) {
            if (acc[storeId][category]) {
                acc[storeId][category].push(usage);
            } else {
                acc[storeId][category] = [usage];
            }
        } else {
            acc[storeId] = {
                [category]: [usage]
            };
        }
        return acc;
    }, {} as MerchantUsagesByStoreCategory);
