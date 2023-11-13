export const baseURL =
    process.env.NODE_ENV === "production"
        ? "https://www.kolonymart.com"
        : "http://localhost:3000";

export const SUPPORT_EMAIL = "friendiesupport@gmail.com";

export const supabaseTables = {
    product_categories: "product_categories",
    store_product_categories: "store_product_categories",
    stores: "stores",
    products: "products",
    merchants: "merchants",
    merchant_staffs: "merchant_staffs",
    roles: "roles",
    permissions: "permissions",
    permissions_for_roles: "permissions_for_roles",
    subscriptions: "subscriptions"
};

export const supabaseBuckets = {
    shop: "shop"
};

export const storageKeys = {
    user: "__tk__"
};
