import React from "react";

//hooks
import { useGetUser } from "@hooks/useGetUser";

//typing
import { Action } from "@db/typing/action.typing";
import { User } from "@db/typing/merchantStaff.typing";
import { RoleTable } from "@db/typing/role.typing";
import { tables } from "@db/tables.db";
import { getRoles } from "@services/roles/roles.services";
import { listenToChangesIn } from "@services/subscriptions.service";
import { getAction } from "@services/action/action.service";

// services
import {
    MerchantUsagesByStoreCategory,
    UsageCategoryType,
    getAppUsages,
    getMerchantUsages,
    transformToMerchantStoreUsageCategory,
    transformUsagesToUsageCategories
} from "@services/usage/usage.services";
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js";
import {
    StoreStaffCategory,
    categorizeMerchantStaffPerStore,
    getStaffsForMerchant
} from "@services/staff/staff.service";
import { StoreTable } from "@db/typing/store.typing";
import { getStores } from "@services/stores/stores.service";
import {
    AccountsByStore,
    bankServices,
    bankTransformers
} from "@services/merchantBankAccounts/merchantBankAccount.service";
import { SupportedCountry } from "@services/finance/banks/typing";
import { getSupportedCountries } from "@services/finance/banks/banks.services";

interface SettingContextProps {
    //roles created by user
    roles: RoleTable[];
    //existing app operations that a user can perform
    actions: Action[];
    stores: StoreTable[];
    user: User;
    //all app usages
    usageCategory: UsageCategoryType;
    staffsByStore: StoreStaffCategory;
    setStaffsByStore: React.Dispatch<React.SetStateAction<StoreStaffCategory>>;
    selectStore: (store: StoreTable) => void;
    currentStore: StoreTable | undefined;
    loading: boolean;
    merchantUsagesByStore: MerchantUsagesByStoreCategory;
    bankAccountsByStore: AccountsByStore;
    bankSupportedCountries: SupportedCountry[];
    setBankAccountsByStore: React.Dispatch<
        React.SetStateAction<AccountsByStore>
    >;
}

const NOP = () => {};

const defaultSettings = {
    roles: [],
    actions: [],
    stores: [],
    user: null,
    usageCategory: {},
    staffsByStore: {},
    setStaffsByStore: NOP,
    selectStore: NOP,
    loading: false,
    currentStore: undefined,
    merchantUsagesByStore: {},
    bankAccountsByStore: {},
    bankSupportedCountries: [],
    setBankAccountsByStore: NOP
};

export const SettingContext = React.createContext<SettingContextProps>({
    ...defaultSettings
});

export const SettingsProvider = ({
    children
}: {
    children: JSX.Element | JSX.Element[];
}) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [roles, setRoles] = React.useState<RoleTable[]>([]);
    const [actions, setActions] = React.useState<Action[]>([]);
    const [usageCategory, setUsageCategory] = React.useState<UsageCategoryType>(
        {}
    );
    const [staffsByStore, setStaffsByStore] =
        React.useState<StoreStaffCategory>({});
    const [stores, setStores] = React.useState<StoreTable[]>([]);
    const [bankAccountsByStore, setBankAccountsByStore] =
        React.useState<AccountsByStore>({});
    const [merchantUsagesByStore, setMerchantUsagesByStore] =
        React.useState<MerchantUsagesByStoreCategory>({});
    const [selectedStore, setSelectedStore] = React.useState<StoreTable>();
    const [bankSupportedCountries, setBankSupportedCountries] = React.useState<
        SupportedCountry[]
    >([]);
    const { user } = useGetUser();
    const merchantId = user?.owner ? user.owner.id : user?.id;

    React.useEffect(() => {
        if (!merchantId) return () => {}; //do nothing
        setLoading(true);
        Promise.all([
            getStores(merchantId).then(async ({ data }) => {
                const fetchedStores = data ?? [];
                setStores(fetchedStores);
                //select the first store by default
                setSelectedStore(fetchedStores[0]);
            }),
            getStaffsForMerchant(merchantId)
                .then(categorizeMerchantStaffPerStore)
                .then((staffCat) => setStaffsByStore(staffCat)),
            getAppUsages()
                .then(transformUsagesToUsageCategories)
                .then((usageCat) => setUsageCategory(usageCat)),
            getRoles(merchantId!).then(({ data }) => setRoles(data ?? [])),
            getAction().then(({ data }) => setActions(data ?? [])),
            getMerchantUsages(merchantId)
                .then(transformToMerchantStoreUsageCategory)
                .then(setMerchantUsagesByStore),
            bankServices
                .getAccountsForMerchant()
                .then(bankTransformers.categorizeAccountsByStore)
                .then(setBankAccountsByStore),
            getSupportedCountries().then(setBankSupportedCountries)
        ]).finally(() => setLoading(false));

        const subscription = listenToChangesIn(
            tables.roles,
            REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
            (payload) => {
                setRoles((roles) => [...roles, payload.new as RoleTable]);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [user?.id]);

    const value = {
        ...defaultSettings,
        roles,
        user,
        actions,
        usageCategory,
        stores,
        staffsByStore,
        setStaffsByStore,
        selectStore: setSelectedStore,
        currentStore: selectedStore,
        loading,
        merchantUsagesByStore,
        bankAccountsByStore,
        bankSupportedCountries,
        setBankAccountsByStore
    };
    return (
        <SettingContext.Provider value={value}>
            {children}
        </SettingContext.Provider>
    );
};
