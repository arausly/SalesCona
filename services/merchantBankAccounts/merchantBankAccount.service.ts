import { tables } from "@db/tables.db";
import { MerchantBankAccountTable } from "@db/typing/merchantBankAccount.typing";
import { supabase } from "@supabase/supabase.browser";

//services
const getAccountsForMerchant = async () =>
    (
        await supabase
            .from(tables.merchantBankAccounts)
            .select()
            .returns<MerchantBankAccountTable[]>()
    ).data ?? [];

//transformers

export interface AccountsByStore {
    [store: string]: MerchantBankAccountTable[];
}

const categorizeAccountsByStore = (accounts: MerchantBankAccountTable[]) =>
    accounts.reduce((cat, account) => {
        if (cat[account.store]) {
            cat[account.store].push(account);
        } else {
            cat[account.store] = [account];
        }
        return cat;
    }, {} as AccountsByStore);

export const bankServices = {
    getAccountsForMerchant
};

export const bankTransformers = {
    categorizeAccountsByStore
};
