"use client";
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface DropdownProps {
    titleIcon?: JSX.Element;
    items: Array<{
        label: string;
        icon?: React.FC<any>;
    }>;
    onSelectItem: (item: string) => void;
    menuButton?: JSX.Element;
    menuClassNames?: string;
    menuItemsClasses?: string;
}

export default function Dropdown(props: DropdownProps) {
    const [selectedOption, setSelectedOption] = React.useState<string>(
        props.items[0]?.label ?? ""
    );
    const handleSelection = React.useCallback(
        (item: DropdownProps["items"][number]) => {
            props.onSelectItem(item.label);
            setSelectedOption(item.label);
        },
        [props]
    );

    return (
        <div className="w-full md:w-56 text-right">
            <Menu
                as="div"
                className={`border border-gray-100 block text-left ${props.menuClassNames}`}
            >
                {!props.menuButton ? (
                    <Menu.Button className="w-full flex items-center space-between rounded-md bg-white px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        {props.titleIcon}
                        <p className="text-black">{selectedOption}</p>
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
                        className={`absolute mt-2 w-full md:w-56 origin-top-right divide-y divide-gray-100 bg-white opacity-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${props.menuItemsClasses}`}
                    >
                        <div className="px-1 py-1">
                            {props.items.map((item) => (
                                <Menu.Item key={item.label}>
                                    {({ active }) => (
                                        <button
                                            onClick={() =>
                                                handleSelection(item)
                                            }
                                            className={`${
                                                active
                                                    ? "primary-bg text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-5 w-5" />
                                            )}
                                            {item.label}
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
