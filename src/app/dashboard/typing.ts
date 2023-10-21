export interface MerchantUser {
    id: string;
    created_at: string;
    email: string;
    owner_id: MerchantUser;
    role: Role;
    firstname: string;
    lastname: string;
}

export interface Role {
    label: string;
    store: string;
    merchant: MerchantUser;
    id: string;
}

export interface Permission {
    id: number;
    title: string;
    description: string;
}
