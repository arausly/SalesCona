import React from "react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@components/ui/sheet";
import { Bank, SupportedCountry } from "@services/finance/banks/typing";
import { getBanks } from "@services/finance/banks/banks.services";
import { MerchantBankAccount } from "@db/typing/merchantBankAccount.typing";
import Dropdown from "@components/Menudropdown";
import {
    BuildingLibraryIcon,
    CheckIcon,
    ChevronUpDownIcon
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
    CommandItem
} from "@components/ui/command";
import { cn } from "@lib/utils";

interface FormProps {
    currentAccount?: MerchantBankAccount;
}

export const BankAccountFormSheet = React.forwardRef(
    (props: FormProps, ref: any) => {
        const { bankSupportedCountries } = React.useContext(SettingContext);
        const [open, setOpen] = React.useState(false);
        const [value, setValue] = React.useState("");
        const [banks, setBanks] = React.useState<Bank[]>([]);
        const [selectedCountry, setSelectedCountry] =
            React.useState<SupportedCountry>();

        React.useEffect(() => {
            if (selectedCountry) {
                getBanks(selectedCountry.name).then(setBanks);
            } else {
                setSelectedCountry(bankSupportedCountries[0]);
            }
        }, [selectedCountry, bankSupportedCountries]);

        console.log({ banks, selectedCountry });

        const handleCountrySelection = React.useCallback(
            (country: SupportedCountry) => setSelectedCountry(country),
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
                        <SheetTitle>
                            {props.currentAccount ? "Edit" : "Add"} account
                        </SheetTitle>
                        <SheetDescription>
                            Make changes to account details here. Click save
                            when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 py-4">
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
                                Country
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {value
                                            ? banks.find(
                                                  (bank) => bank.value === value
                                              )?.label
                                            : "Select bank..."}
                                        <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search bank..."
                                            className="h-9"
                                        />
                                        <CommandEmpty>
                                            No bank found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {banks.map((bank) => (
                                                <CommandItem
                                                    key={bank.id}
                                                    value={bank.value}
                                                    onSelect={(
                                                        currentValue
                                                    ) => {
                                                        setValue(
                                                            currentValue ===
                                                                value
                                                                ? ""
                                                                : currentValue
                                                        );
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {bank.label}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            value === bank.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    }
);
