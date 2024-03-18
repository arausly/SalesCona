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
import { useGetLocationCategory } from "@hooks/useGetLocationCategory";
import { Separator } from "@components/ui/separator";

export const Usages = () => {
    const settingContext = React.useContext(SettingContext);
    const { ifNG } = useGetLocationCategory();

    return (
        <div className="mt-4 flex flex-col">
            <Accordion type="single" collapsible className="w-full">
                {Object.entries(settingContext.usageCategory).map(
                    ([title, privileges], i) => {
                        return (
                            <AccordionItem value={title} key={title}>
                                <AccordionTrigger>{title}</AccordionTrigger>
                                <AccordionContent className="space-y-8 p-4">
                                    {privileges.map((privilege) => (
                                        <React.Fragment key={privilege.name}>
                                            <div className="flex items-center justify-between">
                                                <p>{privilege.name}</p>
                                                <Switch />
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }
                )}
            </Accordion>
            <Button className="primary-bg self-end mt-4">Add usages</Button>
        </div>
    );
};
