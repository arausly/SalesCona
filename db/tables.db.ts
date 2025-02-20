export const tables = {
    productCategories: "product_categories",
    storeProductCategories: "store_product_categories",
    stores: "stores",
    products: "products",
    merchants: "merchants",
    merchantStaffs: "merchant_staffs",
    roles: "roles",
    actions: "actions",
    actionsForRoles: "actions_for_roles",
    merchantBankAccounts: "merchant_bank-accounts",
    merchantBillings: "merchant_billings",
    merchantCards: "merchant_cards",
    merchantCharges: "merchant_charges",
    merchantTransactions: "merchant_transactions",
    merchantUsages: "merchant_usages",
    usageCategories: "usage_categories",
    usages: "usages",
    merchantStoreSocials: "merchant_store_socials",
    storeDeliveryChargePerLocation: "store_delivery_charge_per_location",
    productCosts: "product_costs",
    merchantAffiliateLinks: "merchant_affiliate_links",
    merchantAffiliateLinksStats: "merchant_affiliate_links_statistics",
    merchantCouponCodes: "merchant_coupon_codes",
    emailTemplates: "email_templates",
    merchantEmails: "merchant_emails",
    shopTemplates: "shop_templates"
} as const;

export type tableKeys = keyof typeof tables;
export type tableType = (typeof tables)[tableKeys];
