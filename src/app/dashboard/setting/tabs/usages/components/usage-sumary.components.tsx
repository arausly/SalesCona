import React from "react";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useGetUser } from "@hooks/useGetUser";
import { dateToReadableFormat } from "@lib/format-utils";
import { SettingContext } from "../../../contexts/setting.context";
import { Spinner } from "@components/Spinner";

export const UsageSummary = () => {
    const { user } = useGetUser();
    const { currentStore, loading } = React.useContext(SettingContext);
    const userHasSubscription = !!user?.usage_start_date;

    if (!user) return null;
    if (loading) return <Spinner size="medium" />;

    const billingInfo = [
        {
            title: "Start Date",
            content: dateToReadableFormat(user.usage_start_date)
        },
        {
            title: "Next Billing Date",
            content: dateToReadableFormat(user.next_billing_date)
        },
        {
            title: "Next Billing Amount",
            content: user.next_billing_amount_naira
        }
    ];

    return (
        <Card className="w-full shadow-md  space-y-1">
            <CardHeader className="flex flex-row items-center justify-between w-full">
                <p className="text-sm">
                    Usage details for {currentStore?.name}
                </p>
                <div className="flex items-center">
                    <Button className="primary-bg">Add usages</Button>
                    {userHasSubscription ? (
                        <Button className="ml-4" variant="ghost">
                            <p className="text-red-400">Cancel usages</p>
                        </Button>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-xl flex items-center font-semibold">
                    {userHasSubscription ? "Using 4 privileges" : "Free"}
                    {userHasSubscription && (
                        <div className="flex justify-center items-center ml-2 cursor-pointer">
                            <InformationCircleIcon className="w-5 h-5" />
                        </div>
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
                    <div className="flex items-center space-x-20">
                        {billingInfo.map((info) => (
                            <div className="flex flex-col">
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
