import { supabaseTables } from "../../db/tables.db";
import { supabase } from "../../supabase/supabase.browser";

//typing
import { SubscriptionPopulatedWithCategoryInfo } from "../../db/typing";

export const getSubscriptions = async () => {
    const { data, error } = await supabase
        .from(supabaseTables.subscriptions)
        .select("*,category(*)")
        .returns<SubscriptionPopulatedWithCategoryInfo[]>();
    if (error) throw error;
    return data;
};

/** group subscription by category */
export const transformSubscription = (
    subscriptions: SubscriptionPopulatedWithCategoryInfo[]
) => {
    return subscriptions.reduce((groupedSubscription, subscription) => {
        const catName = subscription.category.name;
        if (!groupedSubscription.has(catName)) {
            groupedSubscription.set(catName, [subscription]);
        } else {
            groupedSubscription.set(catName, [
                ...(groupedSubscription.get(catName) ?? []),
                subscription
            ]);
        }
        return groupedSubscription;
    }, new Map<string, SubscriptionPopulatedWithCategoryInfo[]>());
};
