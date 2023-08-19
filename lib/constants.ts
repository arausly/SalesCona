export const baseURL =
    process.env.NODE_ENV === "production"
        ? "https://www.kolonymart.com"
        : "http://localhost:3000";

export const SUPPORT_EMAIL = "friendiesupport@gmail.com";

export const supabaseTables = {
    product_categories: "product_categories",
    store_product_categories: "store_product_categories",
    stores: "stores"
};

export const supabaseBuckets = {
    shop: "shop"
};

export const storageKeys = {
    user: "__tk__"
};
