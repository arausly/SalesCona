import React from "react";

import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@components/ui/sheet";
import { Bank, SupportedCountry } from "@services/finance/banks/typing";
import { getBanks } from "@services/finance/banks/banks.services";
import Dropdown from "@components/Menudropdown";
import {
    BanknotesIcon,
    BuildingLibraryIcon,
    CheckIcon,
    ChevronUpDownIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline";
import { SettingContext } from "../../../../contexts/setting.context";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@components/ui/command";
import { cn } from "@lib/utils";
import { Spinner } from "@components/Spinner";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { Tooltip } from "@components/Tooltip";
import { useToggleSheet } from "@hooks/toggleSheet";
import { bankServices } from "@services/merchantBankAccounts/merchantBankAccount.service";

const remittances = [
    { id: "daily", label: "Daily", value: "daily" },
    { id: "monthly", label: "Monthly", value: "monthly" },
    { id: "weekly", label: "Weekly", value: "weekly" }
];

const defaultFreq = {
    is_daily: false,
    is_monthly: false,
    is_weekly: false
};

const remittanceMapping = {
    monthly: {
        ...defaultFreq,
        is_monthly: true
    },
    weekly: {
        ...defaultFreq,
        is_weekly: true
    },
    daily: {
        ...defaultFreq,
        is_daily: true
    }
} as const;

export const BankAccountFormSheet = React.forwardRef((props, ref: any) => {
    const {
        bankSupportedCountries,
        currentStore,
        user,
        setBankAccountsByStore
    } = React.useContext(SettingContext);
    const [open, setOpen] = React.useState(false);
    const [selectedBank, setSelectedBank] = React.useState<Bank>();
    const [banks, setBanks] = React.useState<Bank[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [accountNumber, setAccountNumber] = React.useState<string>("");
    const [accountName, setAccountName] = React.useState("");
    const [transferOnly, setTransferOnly] = React.useState<boolean>(true);
    const [acctNumberBlurred, setAcctNumberBlurred] =
        React.useState<boolean>(false);
    const [remittanceFrequency, setRemittanceFrequency] = React.useState({
        ...defaultFreq
    });
    const [country, setCountry] = React.useState<SupportedCountry>();
    const [savingChanges, setSavingChanges] = React.useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] =
        React.useState<SupportedCountry>();
    const [formErrorMsg, setFormErrorMsg] = React.useState<string>("");

    const toggleSheet = useToggleSheet(ref);

    React.useEffect(() => {
        if (selectedCountry) {
            setLoading(true);
            getBanks(selectedCountry.name)
                .then(setBanks)
                .finally(() => setLoading(false));
        } else {
            setSelectedCountry(bankSupportedCountries[0]);
        }
    }, [selectedCountry, bankSupportedCountries]);

    React.useEffect(() => {
        if (selectedBank && accountNumber && acctNumberBlurred) {
            fetch("/api/bank/verify", {
                method: "post",
                body: JSON.stringify({
                    accountNumber,
                    bankCode: selectedBank.code
                })
            })
                .then((res) => res.json())
                .then((json) => setAccountName(json.data.account_name));
        }
    }, [selectedBank, accountNumber, acctNumberBlurred]);

    const handleCountrySelection = React.useCallback(
        (country: SupportedCountry) => setSelectedCountry(country),
        []
    );

    const toggleTransFerOnly = React.useCallback(
        (c: boolean) => setTransferOnly(c),
        []
    );

    const saveAccount = React.useCallback(async () => {
        try {
            if (!accountName) {
                setFormErrorMsg(
                    "Account name is required, make sure your account number and bank is correct"
                );
                return;
            }
            if (!currentStore || !user) return;
            setSavingChanges(true);
            const merchant = user.owner ? user.owner.id : user.id;
            const { data, error } = await bankServices.createAccount({
                account_name: accountName,
                account_number: accountNumber,
                logo: selectedBank?.logo,
                store: currentStore?.id,
                merchant,
                bank_code: selectedBank?.code,
                bank_name: selectedBank?.name,
                country: country?.name,
                ...remittanceFrequency
            });
            if (data && !error) {
                setBankAccountsByStore((prev) => {
                    return {
                        ...prev,
                        [currentStore.id]: [...prev[currentStore.id], ...data]
                    };
                });
                toggleSheet();
            }
        } catch (err) {
        } finally {
            setSavingChanges(false);
        }
    }, [
        accountName,
        accountNumber,
        selectedBank,
        remittanceFrequency,
        currentStore
    ]);

    const handleRemittancePeriodChange = React.useCallback(
        (period: (typeof remittances)[number]) =>
            setRemittanceFrequency(
                remittanceMapping[period.id as keyof typeof remittanceMapping]
            ),
        []
    );

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="hidden" ref={ref}>
                    Open
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add account</SheetTitle>
                    <SheetDescription>
                        Make changes to account details here. Click save when
                        you're done.
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-4">
                    <div className="flex flex-col">
                        <Label htmlFor="name" className="mb-2">
                            Country
                        </Label>
                        <Dropdown
                            wrapperClasses="md:w-full"
                            titleIcon={
                                <BuildingLibraryIcon
                                    className="ml-2 -mr-1 h-5 w-5 text-black mr-2"
                                    aria-hidden="true"
                                />
                            }
                            items={bankSupportedCountries}
                            onSelectItem={handleCountrySelection}
                        />
                    </div>
                    <div className="flex flex-col">
                        <Label htmlFor="name" className="mb-2">
                            Bank
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {selectedBank?.value || "Select bank..."}
                                    <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search bank..."
                                        className="h-9"
                                    />
                                    <CommandEmpty>No bank found.</CommandEmpty>
                                    <CommandList>
                                        {loading && <Spinner />}
                                        <CommandGroup>
                                            {banks.map((bank) => (
                                                <CommandItem
                                                    key={bank.id}
                                                    value={bank.value}
                                                    onSelect={(
                                                        currentValue: string
                                                    ) => {
                                                        setSelectedBank(
                                                            currentValue ===
                                                                selectedBank?.value
                                                                ? undefined
                                                                : bank
                                                        );
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {bank.label}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            selectedBank?.value ===
                                                                bank.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col">
                        <Label htmlFor="name" className="mb-2">
                            Account number
                        </Label>
                        <Input
                            type="number"
                            placeholder="7362562355653"
                            value={accountNumber}
                            onFocus={() => setAcctNumberBlurred(false)}
                            onBlur={() => setAcctNumberBlurred(true)}
                            onChange={(e) => setAccountNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <Label htmlFor="name" className="mb-2">
                            Account name
                        </Label>
                        <Input disabled type="text" placeholder={accountName} />
                        {formErrorMsg && (
                            <p className="text-xs text-red-400">
                                {formErrorMsg}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="name"
                            className="mb-2 flex items-center"
                        >
                            <p>Transfer only</p>
                            <Tooltip
                                message="Payments would be made to this account directly, if switched off payment would first be made to us then to this account periodically"
                                tooltipContentClasses="bg-[#3C4048] text-white font-light w-fit ml-0 pl-4"
                            >
                                <div className="flex justify-center items-center ml-2 cursor-pointer">
                                    <InformationCircleIcon className="w-5 h-5" />
                                </div>
                            </Tooltip>
                        </Label>
                        <Switch
                            checked={transferOnly}
                            onCheckedChange={toggleTransFerOnly}
                        />
                    </div>
                    {!transferOnly && (
                        <div className="flex flex-col">
                            <Label htmlFor="name" className="mb-2">
                                Remittance periods
                            </Label>
                            <Dropdown
                                wrapperClasses="md:w-full"
                                titleIcon={
                                    <BanknotesIcon
                                        className="ml-2 -mr-1 h-5 w-5 text-black mr-2"
                                        aria-hidden="true"
                                    />
                                }
                                items={remittances}
                                onSelectItem={handleRemittancePeriodChange}
                            />
                        </div>
                    )}
                </div>
                <SheetFooter className="mt-4">
                    <Button
                        disabled={savingChanges}
                        type="submit"
                        onClick={saveAccount}
                    >
                        {savingChanges ? <Spinner /> : "Add account"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
});
