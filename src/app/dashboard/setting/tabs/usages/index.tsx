import React from "react";

//components
import { UsageSummary } from "./components/usage-sumary.components";
import { Usages } from "./components/usages.components";
import { StoreDropdown } from "@components/shared/StoreDropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

//context
import { SettingContext } from "../../contexts/setting.context";
import { StoreBankAccount } from "./components/bank-accounts.components";

interface UsageProps {}

//Merchant staff should never get to this page
export const UsageTab: React.FC<UsageProps> = ({}) => {
    const settingContext = React.useContext(SettingContext);

    return (
        <div className="flex flex-col w-full items-center justify-center px-0 md:px-6 mt-16 lg:px-8 space-y-8">
            <StoreDropdown
                stores={settingContext.stores}
                handleSelection={settingContext.selectStore}
            />
            <UsageSummary />
            <Tabs defaultValue="usages" className="w-full flex flex-col">
                <TabsList className="w-fit self-center">
                    <TabsTrigger value="usages">Usages</TabsTrigger>
                    <TabsTrigger value="billings">Billing</TabsTrigger>
                </TabsList>
                <TabsContent value="usages">
                    <Usages />
                </TabsContent>
                <TabsContent value="billings">Billing history here</TabsContent>
            </Tabs>
            <StoreBankAccount />
        </div>
    );
};
