//utility that verifies that a merchant can carry out certain operations
//what a merchant can't do a merchant staff can't as well.

import { User } from "@db/typing/merchantStaff.typing";
import { ActionKeys } from "@lib/permissions/typing";
import { getStores } from "@services/stores/stores.service";
import {
    UsageAggregate,
    getMerchantUsages,
    transformMerchantUsages
} from "@services/usage/usage.services";

type UsageNotificationQueue = {
    message: string;
    action: ActionKeys;
    currentUsagePrivilege: string;
};

export default class Usage {
    user: User = null;
    usageAggregate: UsageAggregate | null = null;
    notificationQueue: UsageNotificationQueue[] = [];

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

    private appendQueue = (newNotification: UsageNotificationQueue) =>
        this.notificationQueue.unshift(newNotification);

    removeFromQueue = (action: ActionKeys) => {
        this.notificationQueue = this.notificationQueue.filter(
            (n) => n.action !== action
        );
    };

    //checks if a user is allowed to create new store
    private canCreateNewStore = async (): Promise<boolean> => {
        if (!this.usageAggregate || !this.merchantId) return false;
        //whats your usage cap?
        const usageLevel = this.usageAggregate.createNewStore.level;

        if (usageLevel) {
            //can create multiple stores
            return true;
        } else {
            //if check if your store count is less than the usage cap
            try {
                const { data, error } = await getStores(this.merchantId);
                if (error) return false;
                if (data.length) {
                    //already have an exiting store

                    //add notification to queue
                    this.appendQueue({
                        currentUsagePrivilege:
                            this.usageAggregate.createNewStore.privilege,
                        action: ActionKeys.toCreateStore,
                        message:
                            "Upgrade store usage limit, to create a new store"
                    });
                    return false;
                }
            } catch (err) {}

            return true;
        }
    };

    //decides what a merchant can and cannot do
    has = async (action: ActionKeys): Promise<boolean> => {
        switch (action) {
            case ActionKeys.toCreateStore:
                return await this.canCreateNewStore();
            default:
                return true;
        }
    };
}
