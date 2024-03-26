import { tables } from "@db/tables.db";
import { MerchantBankAccountTable } from "@db/typing/merchantBankAccount.typing";
import { supabase } from "@supabase/supabase.browser";

//services
const getAccountsForMerchant = async () =>
    (
        await supabase
            .from(tables.merchantBankAccounts)
            .select()
            .eq("is_deleted", false)
            .returns<MerchantBankAccountTable[]>()
    ).data ?? [];

const createAccount = async (payload: Partial<MerchantBankAccountTable>) =>
    await supabase
        .from(tables.merchantBankAccounts)
        .insert(payload)
        .select()
        .returns<MerchantBankAccountTable[]>();

const deleteAccount = async (id: string) =>
    await supabase
        .from(tables.merchantBankAccounts)
        .update({ is_deleted: true })
        .eq("id", id);
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
    getAccountsForMerchant,
    createAccount,
    deleteAccount
};

export const bankTransformers = {
    categorizeAccountsByStore
};
