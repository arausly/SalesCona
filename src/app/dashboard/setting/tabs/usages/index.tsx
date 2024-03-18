import React from "react";

import { Switch } from "@components/ui/switch";
import { SettingContext } from "../../contexts/setting.context";
import { StoreDropdown } from "@components/shared/StoreDropdown";
import { UsageSummary } from "./components/usage-sumary.components";

interface UsageProps {}

const tabIds = { usages: 0, billing: 1 };

//Merchant staff should never get to this page
export const UsageTab: React.FC<UsageProps> = ({}) => {
    const settingContext = React.useContext(SettingContext);
    const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(0);

    return (
        <div className="flex flex-col w-full items-center justify-center px-0 md:px-6 mt-16 lg:px-8 space-y-4">
            <StoreDropdown
                stores={settingContext.stores}
                handleSelection={settingContext.selectStore}
            />
            <UsageSummary />
            {/* <Tabs></Tabs> */}
        </div>
    );
};
