import React from "react";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFirstRender } from "@hooks/useFirstRender";

export interface MultiSelectProps {
    //What are the items about
    title?: string;
    items: Array<{
        id: string | number;
        label: string;
    }>;
    onSelect: (selectedCategories: MultiSelectProps["items"]) => void;
    createNewItem?: (
        label: string
    ) => Promise<MultiSelectProps["items"][number] | undefined>;
    initialItems?: Array<{
        id: number;
        label: string;
    }>;
    multiple?: boolean;
    placeholder?: string;
    inputNonInteractive?: boolean;
    onQueryChange?: (query: string) => void;
}

export function formatRawItems<T>(
    rawItems: { name: string; id: any }[]
): T | any[] {
    return rawItems.map((rad) => ({
        label: rad.name,
        ...rad
    }));
}

export default function MultiSelectInput({
    title,
    items,
    onSelect,
    createNewItem,
    multiple = true,
    initialItems = [],
    placeholder,
    inputNonInteractive,
    onQueryChange
}: MultiSelectProps) {
    const [selected, setSelected] =
        useState<MultiSelectProps["items"]>(initialItems);
    const [query, setQuery] = useState("");
    const [displayValue, setDisplayValue] = React.useState<string>();
    const firstRender = useFirstRender();

    //this is only useful for non-interactive input
    const handleSetDisplayValue = React.useCallback(
        (items: any) => {
            if (firstRender || !inputNonInteractive) return;
            // Perform state updates or trigger state changes here
            // This code will run after the component has finished rendering

            // Example: Update selectedOptions state after 2 seconds
            const timeout = setTimeout(() => {
                setDisplayValue(items);
            }, 50);

            return () => {
                // Clean up any timers or subscriptions if necessary
                clearTimeout(timeout);
            };
        },
        [firstRender]
    );

    /* as long as there is a parent queryChange handler
     * used as an external filtration logic to update the items automatically
     */
    const filteredItems =
        query === "" || onQueryChange
            ? items
            : items.filter((item) =>
                  item.label
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    const handleCreateNewLabel = React.useCallback(
        async (label: string) => {
            if (!createNewItem) return;
            const newItem = await createNewItem(label);
            if (newItem) {
                setSelected((prev) => [...prev, newItem]);
            }
        },
        [createNewItem]
    );

    const handleSelection = React.useCallback(
        (items: any) => {
            setSelected(items);
            onSelect(Array.isArray(items) ? items : [items]);
        },
        [onSelect]
    );

    const handleQueryChange = React.useCallback((searchQuery: string) => {
        const [exactQuery] = searchQuery.split(",").slice(-1); // always take the string after the last comma
        setQuery(exactQuery.trim());
        onQueryChange && onQueryChange(exactQuery.trim());
    }, []);

    const clearSelection = React.useCallback(() => {
        handleSelection([]);
        setQuery("");
        onSelect([]);
    }, [handleSelection, onSelect]);

    // the type false, I really don't understand, I think it's a type bug with the combobox
    return (
        <Combobox<any, any>
            value={selected}
            onChange={handleSelection}
            multiple={multiple as false}
        >
            <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        displayValue={(items: any) => {
                            const displayVal = multiple
                                ? items
                                      .map((item: any) => item.label)
                                      .join(", ")
                                : items.label;
                            handleSetDisplayValue(displayVal);
                            return displayVal;
                        }}
                        onChange={(event) =>
                            handleQueryChange(event.target.value)
                        }
                        placeholder={placeholder ?? "Choose from options"}
                    />
                    {inputNonInteractive && (
                        <div className="absolute left-0 right-0 top-0 bottom-0 w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                            {(displayValue || placeholder) ??
                                "Choose from options"}
                        </div>
                    )}
                    {selected.length && !inputNonInteractive ? (
                        <div
                            className="absolute inset-y-0 right-5 cursor-pointer flex items-center pr-2"
                            onClick={clearSelection}
                        >
                            <XMarkIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                    ) : null}
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >
                    <Combobox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredItems.length === 0 &&
                        createNewItem &&
                        query !== "" ? (
                            <div
                                className="relative cursor-pointer flex items-center w-full select-none py-2 px-4 text-gray-700 hover:bg-slate-100"
                                onClick={() => handleCreateNewLabel(query)}
                            >
                                <p className="capitalize mr-1">{`"${query}" ${title}`}</p>
                                <p>{"doesn't exist, click to create?"} </p>
                            </div>
                        ) : filteredItems.length === 0 &&
                          !createNewItem &&
                          query !== "" ? (
                            <div
                                className="relative cursor-pointer flex items-center w-full select-none py-2 px-4 text-gray-700 hover:bg-slate-100"
                                onClick={() => handleCreateNewLabel(query)}
                            >
                                <p className="capitalize mr-1">{`"${query}" ${title}`}</p>
                                <p>{"doesn't exist"} </p>
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <Combobox.Option
                                    key={item.id}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active
                                                ? "primary-bg text-white"
                                                : "text-gray-900"
                                        }`
                                    }
                                    value={item}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate capitalize ${
                                                    selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                }`}
                                            >
                                                {item.label}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active
                                                            ? "text-white"
                                                            : "text-[#6d67e4]"
                                                    }`}
                                                >
                                                    <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
}
