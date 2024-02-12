import React from "react";

import { SubscriptionMetadata, SubscriptionPlan } from "../typing";
import { useGetUser } from "@hooks/useGetUser";
import { Switch } from "@components/ui/switch";

interface PaymentProps {
    subscriptions: SubscriptionMetadata[];
}

//Merchant staff should never get to this page
export const Payment: React.FC<PaymentProps> = ({ subscriptions }) => {
    const { user } = useGetUser();

    return (
        <div className="flex flex-col w-full items-center justify-center px-0 md:px-6 mt-16 lg:px-8">
            <p>subscription</p>
        </div>
    );
};
