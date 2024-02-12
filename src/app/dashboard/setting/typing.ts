export interface SubscriptionPlan {
    id: string;
    name: string;
    trial_period: number;
    price_universal: number;
    price_NG: number;
}

export interface SubscriptionMetadata extends SubscriptionPlan {
    style_config: {
        bgColor: string;
        buttonColor: string;
    };
}
