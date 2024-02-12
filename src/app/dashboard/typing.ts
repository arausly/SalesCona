import { User } from "@supabase/supabase-js";

export interface Merchant extends Omit<User, "role"> {
    id: string;
    created_at: string;
    email: string;
    firstname: string;
    lastname: string;
    last_active: string;
    trial_started_at: string;
    subscription_start_date: string;
    subscription_end_date: string;
    subscription: string;
}

export interface MerchantStaff extends Merchant {
    owner: Merchant;
    auth_id: string;
    last_active: string;
    role: Role;
    suspended: boolean;
    is_deleted: boolean;
    firstname: string;
    lastname: string;
}

export interface Role {
    label: string;
    store: string;
    merchant: Merchant;
    id: string;
}

export interface Permission {
    id: number;
    title: string;
    description: string;
}
