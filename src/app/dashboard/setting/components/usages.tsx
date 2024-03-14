import React from "react";

import { Switch } from "@components/ui/switch";
import { Usage } from "@db/typing/usage.typing";
import { SettingContext } from "../contexts/setting.context";

interface UsageProps {}

//Merchant staff should never get to this page
export const UsageTab: React.FC<UsageProps> = ({}) => {
    const context = React.useContext(SettingContext);
    console.log({ context });

    return (
        <div className="flex flex-col w-full items-center justify-center px-0 md:px-6 mt-16 lg:px-8">
            <p>subscription</p>
        </div>
    );
};
