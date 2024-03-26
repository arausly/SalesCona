import React from "react";

import { Separator } from "@components/ui/separator";
import { SettingContext } from "../../../contexts/setting.context";
import { MerchantBankAccountTable } from "@db/typing/merchantBankAccount.typing";
import { BuildingLibraryIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@components/Tooltip";
import { Button } from "@components/ui/button";
import { BankAccountFormSheet } from "./sheets/bank-account.sheets";

const payTranslation = (obj: any) => {
    if (obj.is_daily) return "day";
    else if (obj.is_weekly) return "week";
    else if (obj.is_monthly) return "month";
};

const BankAccountCard: React.FC<
    MerchantBankAccountTable & { openSheet: () => void }
> = (props) => {
    return (
        <div className="w-max md:w-64 bg-white shadow-md">
            <span className="h-1 w-full primary-bg flex rounded-t" />
            <div className="flex items-center p-2 rounded-md relative">
                <div className="w-10 h-10 rounded-full mr-4 bg-auto">
                    {props.logo ? (
                        <img
                            src={props.logo}
                            className="w-full h-full rounded-full"
                        />
                    ) : (
                        <BuildingLibraryIcon className="w-full h-full" />
                    )}
                </div>
                <div className="flex flex-col space-y-1">
                    <p className="text-xs">{props.account_name}</p>
                    <p className="text-xs">{props.bank_name}</p>
                    <p className="text-xs text-zinc-600">
                        paid every {payTranslation(props)}
                    </p>
                </div>
                <div
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={props.openSheet}
                >
                    <Tooltip
                        message="change bank details"
                        tooltipContentClasses="bg-[#3C4048] text-white font-light w-fit ml-0 pl-4"
                    >
                        <PencilIcon className="w-4 h-4 self-start" />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export const StoreBankAccount = () => {
    const { bankAccountsByStore, currentStore } =
        React.useContext(SettingContext);
    const sheetRef = React.useRef<HTMLButtonElement>();

    const openAccountFormSheet = React.useCallback(() => {
        const trigger = sheetRef.current;
        if (trigger) {
            trigger.click();
        }
    }, [sheetRef]);

    if (!currentStore) return null; //unlikely at this point

    const bankAccounts = bankAccountsByStore[currentStore.id] ?? [];

    return (
        <section className="w-full">
            <BankAccountFormSheet ref={sheetRef} />
            <p className="text-lg font-semibold">Bank Accounts</p>
            <Separator className="mb-8" />
            {!bankAccounts.length ? (
                <>
                    <p className="text-sm mb-2">
                        You currently do no have any bank account added to this
                        store
                    </p>
                    <Button
                        className="primary-bg"
                        onClick={openAccountFormSheet}
                    >
                        Add bank account
                    </Button>
                </>
            ) : (
                <div className="flex-wrap space-x-2 space-y-2">
                    {bankAccounts.map((account) => (
                        <BankAccountCard
                            {...account}
                            openSheet={openAccountFormSheet}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};
