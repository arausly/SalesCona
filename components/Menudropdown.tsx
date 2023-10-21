"use client";
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export interface DropdownProps<T> {
    titleIcon?: JSX.Element;
    title?: string;
    items: Array<
        Partial<T> & {
            label: string;
            icon?: React.FC<any>;
            decoy?: boolean; //trigger external actions only instead of selecting as an item
        }
    >;
    onSelectItem: (item: T) => void;
    menuButton?: JSX.Element;
    menuClassNames?: string;
    wrapperClasses?: string;
    menuItemsClasses?: string;
    highlightButtonOnClick?: boolean;
}

export default function Dropdown<T>(props: DropdownProps<T>) {
    const [selectedOption, setSelectedOption] = React.useState<string>();
    const [activeLabels, setActiveLabels] = React.useState<
        Map<string, boolean>
    >(new Map());
    const handleSelection = React.useCallback(
        (item: DropdownProps<T>["items"][number]) => {
            props.onSelectItem(item as T);
            if (!item.decoy) {
                setSelectedOption(item.label);
                if (props.highlightButtonOnClick) {
                    setActiveLabels((prev) => {
                        if (prev.has(item.label)) {
                            prev.delete(item.label);
                            return new Map([...prev]);
                        } else {
                            return new Map([...prev, [item.label, true]]);
                        }
                    });
                }
            }
        },
        [props]
    );

    return (
        <div
            className={`relative w-full md:w-56 text-right ${props.wrapperClasses}`}
        >
            <Menu
                as="div"
                className={`border w-full border-gray-100 block text-left ${props.menuClassNames}`}
            >
                {!props.menuButton ? (
                    <Menu.Button className="w-full flex items-center space-between rounded-md bg-white px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        {props.titleIcon}
                        <p className="text-black text-ellipsis overflow-hidden whitespace-nowrap">
                            {selectedOption ??
                                props.title ??
                                props.items[0]?.label}
                        </p>
                        <ChevronDownIcon
                            className="ml-auto -mr-1 h-5 w-5 text-black"
                            aria-hidden="true"
                        />
                    </Menu.Button>
                ) : (
                    props.menuButton
                )}
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        className={`absolute z-50 mt-2 w-full md:w-56 origin-top-right divide-y divide-gray-100 bg-white opacity-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${props.menuItemsClasses}`}
                    >
                        <div className="px-1 py-1">
                            {props.items.map((item, i) => (
                                <Menu.Item key={item.label}>
                                    {({ active }) => (
                                        <button
                                            onClick={() =>
                                                handleSelection(item)
                                            }
                                            className={`${
                                                active ||
                                                activeLabels.has(item.label)
                                                    ? "primary-bg text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-5 w-5" />
                                            )}
                                            <p className="text-ellipsis overflow-hidden whitespace-nowrap capitalize">
                                                {item.label}
                                            </p>
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
