import React from "react";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface MultiSelectProps {
    items: Array<{
        id: string;
        label: string;
    }>;
    onSelect: (selectedCategories: string[]) => void;
    createNewItem: (label: string) => MultiSelectProps["items"][number];
}

export default function MultiSelectInput({
    items,
    onSelect,
    createNewItem,
}: MultiSelectProps) {
    const [selected, setSelected] = useState<MultiSelectProps["items"]>([]);
    const [query, setQuery] = useState("");

    const filteredItems =
        query === ""
            ? items
            : items.filter((item) =>
                  item.label
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    const handleCreateNewLabel = React.useCallback(
        async (label: string) => {
            const newItem = await createNewItem(label);
            setSelected((prev) => [...prev, newItem]);
        },
        [createNewItem]
    );

    const handleSelection = React.useCallback(
        (items: any) => {
            setSelected(items);
            onSelect(items);
        },
        [onSelect]
    );

    const clearSelection = React.useCallback(() => {
        handleSelection([]);
        setQuery("");
        onSelect([]);
    }, [handleSelection, onSelect]);

    return (
        <Combobox<any, any> value={selected} onChange={setSelected} multiple>
            <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        displayValue={(items: MultiSelectProps["items"]) =>
                            items.map((item) => item.label).join(", ")
                        }
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Choose from options"
                    />
                    {selected.length ? (
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
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredItems.length === 0 && query !== "" ? (
                            <div
                                className="relative cursor-pointer flex items-center w-full select-none py-2 px-4 text-gray-700 hover:bg-slate-100"
                                onClick={() => handleCreateNewLabel(query)}
                            >
                                <p className="capitalize mr-1">{`"${query}"`}</p>
                                <p>{"doesn't exist, click to create?"} </p>
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
