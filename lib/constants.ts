export const baseURL =
    process.env.NODE_ENV === "production"
        ? "https://www.kolonymart.com"
        : "http://localhost:3000";

export const SUPPORT_EMAIL = "friendiesupport@gmail.com";

export const storageKeys = {
    user: "__tk__"
};
