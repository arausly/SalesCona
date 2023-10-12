interface MerchantUser {
    id: string;
    created_at: string;
    email: string;
    owner_id: MerchantUser;
    role: Role;
    firstname: string;
    lastname: string;
}

interface Role {
    title: string;
    store: string;
    merchant: MerchantUser;
    id: string;
}
