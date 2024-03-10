//utility that verifies that a merchant can carry out certain operations
//what a merchant can't do a merchant staff can't as well.

import { User } from "@db/typing/merchantStaff.typing";
import { ActionKeys } from "@lib/permissions/typing";
import { getAffiliateLinksForStoreSinceTimeAgo } from "@services/affiliateLinks/afiiliateLinks.service";
import { getCouponsForStoreSinceTimeAgo } from "@services/coupons/coupon.service";
import { getProductsForStore } from "@services/product/product.service";
import { getStaffsForStore } from "@services/staff/staff.service";
import { getStores } from "@services/stores/stores.service";
import {
    UsageAggregate,
    getMerchantUsages,
    transformMerchantUsages
} from "@services/usage/usage.services";

export default class Usage {
    user: User = null;
    usageAggregate: UsageAggregate | null = null;

    constructor(user: User) {
        this.user = user;

        getMerchantUsages(this.merchantId)
            .then(transformMerchantUsages)
            .then((usageAggregate) => {
                this.usageAggregate = usageAggregate;
            });
    }

    get merchantId() {
        return this.user?.owner.id ?? this.user?.id;
    }

    //when store is null, it's because it's a usage above stores level e.g create a store :)
    private getUsage = (usage: ActionKeys, storeId = "store") =>
        this.usageAggregate && this.usageAggregate[`${storeId}`][usage];

    //checks if a user is allowed to create new store
    private canCreateNewStore = async (): Promise<boolean> => {
        //whats your usage cap?
        const usage = this.getUsage(ActionKeys.toCreateStore);
        if (!usage) return false;

        //can create multiple stores
        if (usage.level) return true;

        //if check if your store count is less than the usage cap
        try {
            const { data, error } = await getStores(this.merchantId!);
            if (error) return false;
        } catch (err) {}

        return true;
    };

    /**
     * checks if a user is allowed to add a new product to a store
     *
     * check what the usage cap is
     * if the current number of products in the store exceeds the usage cap, then user needs to upgrade
     */
    private canAddNewProduct = async (storeId: string): Promise<boolean> => {
        try {
            const { data } = await getProductsForStore(storeId);

            const products = data ?? [];

            if (products.length < 10) return true; //free to add products up to 10

            const usage = this.getUsage(ActionKeys.toAddNewProduct, storeId);
            if (!usage) return false;

            const productUsageLevelsCapMap = new Map([
                [0, 10],
                [1, 20],
                [2, 50],
                [3, Infinity]
            ]);

            return (
                products.length <
                productUsageLevelsCapMap.get(usage.level ?? 0)!
            );
        } catch (err) {
            //todo add to logger error for monitoring
            return false;
        }
    };

    private monthlyMeteredResource = async <T>({
        action,
        resourceGetter,
        storeId
    }: {
        action: ActionKeys;
        storeId: string;
        resourceGetter: (
            storeId: string,
            days: number
        ) => Promise<{
            data: T;
            error: any;
        }>;
    }) => {
        try {
            const { data, error } = await resourceGetter(storeId, 30);
            const resources = (data ?? []) as T[];

            if (error) return false;

            //user hasn't created resource since 30 days, then just allow.
            if (!resources.length) return true;

            const usage = this.getUsage(action, storeId);

            if (!usage) return false;

            //the usage level determines the accessibility for resources
            return !!usage.level;
        } catch (err) {
            return false;
        }
    };

    private canCreateCouponCodes = async (
        storeId: string
    ): Promise<boolean> => {
        return this.monthlyMeteredResource({
            storeId,
            action: ActionKeys.toCreateCoupon,
            resourceGetter: getCouponsForStoreSinceTimeAgo
        });
    };

    private canCreateAffiliateLink = async (
        storeId: string
    ): Promise<boolean> => {
        return this.monthlyMeteredResource({
            storeId,
            action: ActionKeys.toCreateAffiliateLink,
            resourceGetter: getAffiliateLinksForStoreSinceTimeAgo
        });
    };

    private canUseEmailMarketingFeature = (storeId: string) =>
        !!this.getUsage(ActionKeys.toAccessEmailMarketing, storeId)?.level;

    private canUseCustomTemplate = async (storeId: string) =>
        !!this.getUsage(ActionKeys.toUseCustomTemplate, storeId)?.level;

    private canUseNotificationFeature = async (storeId: string) =>
        !!this.getUsage(ActionKeys.toAllowCustomerNotification, storeId)?.level;

    private canAddStaff = async (storeId: string): Promise<boolean> => {
        //less than one staff existing, then allow
        //by here return usage level
        try {
            const { data, error } = await getStaffsForStore(
                storeId,
                this.merchantId!
            );

            if (error) return false;

            const staffs = data ?? [];

            if (!staffs.length) return true; //no staff

            return !!this.getUsage(ActionKeys.toAddStaffToStore, storeId)
                ?.level;
        } catch (err) {
            return false;
        }
    };

    //decides what a merchant can and cannot do
    has = async <PayloadType = any>(
        action: ActionKeys,
        payload: PayloadType
    ): Promise<boolean> => {
        if (!this.usageAggregate || !this.merchantId) return false;
        switch (action) {
            case ActionKeys.toCreateStore:
                return await this.canCreateNewStore();
            case ActionKeys.toAddNewProduct:
                return await this.canAddNewProduct(payload as string);
            case ActionKeys.toCreateAffiliateLink:
                return await this.canCreateAffiliateLink(payload as string);
            case ActionKeys.toCreateCoupon:
                return await this.canCreateCouponCodes(payload as string);
            case ActionKeys.toAccessEmailMarketing:
                return this.canUseEmailMarketingFeature(payload as string);
            case ActionKeys.toUseCustomTemplate:
                return this.canUseCustomTemplate(payload as string);
            case ActionKeys.toAllowCustomerNotification:
                return this.canUseNotificationFeature(payload as string);
            case ActionKeys.toAddStaffToStore:
                return await this.canAddStaff(payload as string);
            default:
                return true;
        }
    };
}
