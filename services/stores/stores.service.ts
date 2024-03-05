import { tables } from "@db/tables.db";
import { supabase } from "../../supabase/supabase.browser";
import { Store } from "../../src/app/dashboard/stores/typing";
import { StoreTable } from "@db/typing/store.typing";

/**
 *
 * @param merchantId merchants id not staff
 * @returns
 */
export const getStores = async (merchantId: string) =>
    await supabase
        .from(tables.stores)
        .select()
        .eq("merchant", merchantId)
        .eq("is_soft_deleted", false)
        .returns<StoreTable[]>();

export const searchStores = async ({
    merchantId,
    query
}: {
    merchantId: string;
    query: string;
}) =>
    await supabase
        .from(tables.stores)
        .select()
        .eq("user_id", merchantId)
        .eq("is_soft_deleted", false)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

export const getStoreBySlug = async ({
    slug,
    userId
}: {
    userId: string;
    slug: string;
}) =>
    await supabase
        .from(tables.stores)
        .select()
        .eq("slug", slug)
        .eq("user_id", userId)
        .returns<Store[]>();

export const softDeleteStore = async ({
    userId,
    storeId
}: {
    userId: string;
    storeId: string;
}) =>
    await supabase
        .from(tables.stores)
        .update({ is_soft_deleted: true })
        .eq("user", userId)
        .eq("id", storeId);

export const renameStore = async ({
    name,
    slug,
    storeId,
    userId
}: {
    name: string;
    slug: string;
    userId: string;
    storeId: string;
}) =>
    await supabase
        .from(tables.stores)
        .update({
            name,
            slug
        })
        .eq("user_id", userId)
        .eq("id", storeId);

export const storeWithNameExist = async ({
    userId,
    storeName,
    slug
}: {
    userId: string;
    storeName: string;
    slug: string;
}) =>
    supabase
        .from(tables.stores)
        .select()
        .eq("user_id", userId)
        .or(`name.eq.${storeName},slug.eq.${slug}`);
