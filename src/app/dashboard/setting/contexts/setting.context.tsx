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
    UsageCategoryType,
    getAppUsages,
    transformUsagesToUsageCategories
} from "@services/usage/usage.services";
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js";
import {
    StoreStaffCategory,
    categorizeMerchantStaffPerStore,
    getStaffsForMerchant
} from "@services/staff/staff.service";
import { Store, StoreTable } from "@db/typing/store.typing";
import { getStores } from "@services/stores/stores.service";

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
    currentStore: undefined
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
    const [selectedStore, setSelectedStore] = React.useState<StoreTable>();
    const { user } = useGetUser();
    const merchantId = user?.owner ? user.owner.id : user?.id;

    React.useEffect(() => {
        if (!merchantId) return () => {}; //do nothing
        setLoading(true);
        Promise.all([
            getStores(merchantId).then(({ data }) => setStores(data ?? [])),
            getStaffsForMerchant(merchantId)
                .then(categorizeMerchantStaffPerStore)
                .then((staffCat) => setStaffsByStore(staffCat)),
            getAppUsages()
                .then(transformUsagesToUsageCategories)
                .then((usageCat) => setUsageCategory(usageCat)),
            getRoles(merchantId!).then(({ data }) => setRoles(data ?? [])),
            getAction().then(({ data }) => setActions(data ?? []))
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
    }, [merchantId]);

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
        loading
    };
    return (
        <SettingContext.Provider value={value}>
            {children}
        </SettingContext.Provider>
    );
};
