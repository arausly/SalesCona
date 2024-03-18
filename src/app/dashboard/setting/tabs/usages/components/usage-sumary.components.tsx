import React from "react";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useGetUser } from "@hooks/useGetUser";
import { dateToReadableFormat } from "@lib/format-utils";
import { SettingContext } from "../../../contexts/setting.context";
import { Spinner } from "@components/Spinner";
import { Tooltip } from "@components/Tooltip";
import { useGetLocationCategory } from "@hooks/useGetLocationCategory";

export const UsageSummary = () => {
    const { user } = useGetUser();
    const { currentStore, loading } = React.useContext(SettingContext);
    const { ifNG } = useGetLocationCategory();
    const userHasSubscription = !!currentStore?.usage_start_date;

    if (!currentStore) return null;
    if (loading) return <Spinner size="medium" />;

    const {
        usage_start_date,
        next_billing_date,
        next_billing_amount_naira,
        next_billing_amount_usd
    } = currentStore;

    const billingInfo = [
        {
            title: "Start Date",
            content: dateToReadableFormat(usage_start_date)
        },
        {
            title: "Next Billing Date",
            content: dateToReadableFormat(next_billing_date)
        },
        {
            title: "Next Billing Amount",
            content: ifNG(next_billing_amount_naira, next_billing_amount_usd)
        }
    ];

    return (
        <Card className="w-full shadow-md  space-y-1">
            <CardHeader className="flex flex-row items-center justify-between w-full">
                <p className="text-sm">
                    Usage details for {currentStore?.name}
                </p>
                {userHasSubscription ? (
                    <Button className="ml-4" variant="ghost">
                        <p className="text-red-400">Cancel usages</p>
                    </Button>
                ) : null}
            </CardHeader>
            <CardContent>
                <p className="text-xl flex items-center font-semibold">
                    {userHasSubscription
                        ? `Using ${currentStore.total_privileges ?? 0} privileges`
                        : "Free"}
                    {userHasSubscription && (
                        <Tooltip
                            message="See usages below for more info"
                            side="right"
                            tooltipContentClasses="bg-[#3C4048] text-white w-fit ml-0 pl-4"
                        >
                            <div className="flex justify-center items-center ml-2 cursor-pointer">
                                <InformationCircleIcon className="w-5 h-5" />
                            </div>
                        </Tooltip>
                    )}
                </p>
            </CardContent>
            <CardFooter>
                {!userHasSubscription ? (
                    <p className="text-sm font-light">
                        Add usages to leverage all the great possibilities with
                        SalesCona
                    </p>
                ) : (
                    <div className="flex items-center space-x-32">
                        {billingInfo.map((info) => (
                            <div key={info.title} className="flex flex-col">
                                <p className="text-sm mb-4">{info.title}</p>
                                <p className="text-base font-semibold text-center">
                                    {info.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};
