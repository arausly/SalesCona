import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@components/ui/accordion";
import { Switch } from "@components/ui/switch";

//context
import { SettingContext } from "../../../contexts/setting.context";
import { Button } from "@components/ui/button";
import { UsageCategoryType } from "@services/usage/usage.services";
import { Usage } from "@db/typing/usage.typing";

export const Usages = () => {
    const { currentStore, merchantUsagesByStore, usageCategory } =
        React.useContext(SettingContext);
    const [usageChanges, setUsageChanges] = React.useState<UsageCategoryType>(
        {}
    );
    const [saving, setSaving] = React.useState<boolean>(false);

    const handleSwitchChangeForUsage = React.useCallback((usage: Usage) => {
        setUsageChanges((prev) => {
            const category = usage.category.name;
            if (prev[category]) {
                const foundUsage = prev[category].find(
                    (u) => u.id === usage.id
                ) as Usage & { active: boolean };

                if (foundUsage) {
                    return {
                        ...prev,
                        [category]: prev[category].map((u) => {
                            if (u.id === foundUsage.id) {
                                return {
                                    ...foundUsage,
                                    active: !foundUsage.active
                                };
                            }
                            return u;
                        })
                    };
                } else {
                    return {
                        ...prev,
                        [category]: [
                            ...prev[category],
                            { ...usage, active: true }
                        ]
                    };
                }
            } else {
                return {
                    ...prev,
                    [category]: [{ ...usage, active: true }]
                };
            }
        });
    }, []);

    if (!currentStore) return null; //most unlikely

    const currentUsage = {
        ...(merchantUsagesByStore[currentStore.id] ?? {}),
        ...(merchantUsagesByStore.store ?? {})
    };

    const saveBtnIsDisabled = saving || !Object.keys(usageChanges).length;

    return (
        <div className="mt-4 flex flex-col">
            <Accordion type="single" collapsible className="w-full">
                {Object.entries(usageCategory).map(([title, privileges], i) => {
                    const merchantUsage = currentUsage[title];
                    return (
                        <AccordionItem value={title} key={title}>
                            <AccordionTrigger>{title}</AccordionTrigger>
                            <AccordionContent className="space-y-8 p-4">
                                {privileges.map((privilege) => {
                                    const foundUsage = merchantUsage?.find(
                                        (u) => u.id === privilege.id
                                    );

                                    const merchantHasPrivilege =
                                        foundUsage && foundUsage.active;

                                    const foundChange = (
                                        usageChanges[title] ?? []
                                    ).find((u) => u.id === privilege.id) as any;

                                    return (
                                        <React.Fragment key={privilege.name}>
                                            <div className="flex items-center justify-between">
                                                <p>{privilege.name}</p>
                                                <Switch
                                                    defaultChecked={
                                                        merchantHasPrivilege
                                                    }
                                                    // checked={isChecked}
                                                    onCheckedChange={() =>
                                                        handleSwitchChangeForUsage(
                                                            privilege
                                                        )
                                                    }
                                                />
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            <Button
                className="primary-bg self-end mt-4"
                disabled={saveBtnIsDisabled}
            >
                Save usages
            </Button>
        </div>
    );
};
