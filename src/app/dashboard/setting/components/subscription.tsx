import React from "react";

import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { supabaseTables } from "@lib/constants";
import { useGetUser } from "@hooks/useGetUser";

interface SubscriptionPlan {
    name: string;
    trial_period: number;
    style_config: {
        bgColor: string;
        buttonColor: string;
    };
}

export const Subscription = () => {
    const [subscriptions, setSubscriptions] = React.useState<
        SubscriptionPlan[]
    >([]); //todo move to react context
    const { supabase } = useBrowserSupabase();
    const { user } = useGetUser();

    React.useEffect(() => {
        (async () => {
            const { data, error } = await supabase
                .from(supabaseTables.subscriptions)
                .select()
                .returns<
                    (Omit<SubscriptionPlan, "style_config"> & {
                        style_config: string;
                    })[]
                >();

            if (data && !error) {
                setSubscriptions(
                    data.map((d) => ({
                        ...d,
                        style_config: JSON.parse(d.style_config)
                    }))
                );
            }
        })();
    }, []);

    return (
        <div className="flex flex-col w-full items-center justify-center px-0 md:px-6 mt-16 lg:px-8">
            <div className="flex items-center">
                {subscriptions.map((subscription) => (
                    <div key={subscription.name} className="">
                        <div className="flex items-center"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};
