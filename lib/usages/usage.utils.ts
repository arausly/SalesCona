//utility that verifies that a merchant can carry out certain operations
//what a merchant can't do a merchant staff can't as well.

import { usages } from "./typing";

/**
 * merchantUsages.has(usages.createNewStore)
 */

export default class Usage {
    merchant = null;
    constructor(merchant: any) {
        this.merchant = merchant;
    }

    private canCreateStore = (): boolean => {
        return false;
    };

    //decides what a merchant can and cannot do
    has = (usage: usages): boolean => {
        switch (usage) {
            case usages.createStore:
                return this.canCreateStore();
            default:
                return false;
        }
    };
}
