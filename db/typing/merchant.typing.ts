import { User } from "@supabase/supabase-js";

export interface Merchant extends Omit<User, "role"> {
    id: string;
    created_at: string;
    email: string;
    firstname: string;
    lastname: string;
    last_sign_in_at: string;
    /** if the customer has any paid usages */
    has_subscription: boolean;
    /** auth user id */
    auth_id: string;
    country: string;
    /**@private method not to be accessed, sensitive information only used when absolutely necessary */
    lng_lat: string;
    //if the user has paid for any usage, the start date for the earliest usage
    usage_start_date: string;
    next_billing_date: string;
    next_billing_amount_usd: string;
    next_billing_amount_naira: string;
}
