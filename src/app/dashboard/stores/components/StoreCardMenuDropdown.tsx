"use client";
import React, { ReactNode } from "react";
import Dropdown from "@components/Menudrown";
import { Menu } from "@headlessui/react";
import {
    EllipsisHorizontalIcon,
    PencilIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { StoreContext } from "./StoreList";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { generateShopAlias } from "@lib/common.utils";
import { Store } from "../typing";
import { baseURL } from "@lib/constants";

interface StoreCardMenuProps {
    store: Store;
}

const actions = [
    { label: "Rename", icon: PencilIcon },
    { label: "Delete", icon: TrashIcon },
    { label: "Open shop page", icon: ArrowTopRightOnSquareIcon }
];

export const StoreCardMenuDropdown: React.FC<StoreCardMenuProps> = (props) => {
    const { toggleDeleteModal, toggleRenameModal, handleStoreSelection } =
        React.useContext(StoreContext);

    const handleDropdownSelection = React.useCallback(
        (item: string) => {
            switch (item) {
                case "Rename":
                    handleStoreSelection(props.store);
                    toggleRenameModal();
                    break;
                case "Delete":
                    handleStoreSelection(props.store);
                    toggleDeleteModal();
                    break;
                case "Open shop page":
                    window.open(
                        `${baseURL}/shop/${generateShopAlias(
                            props.store.name
                        )}`,
                        "_blank",
                        "noreferrer"
                    );
            }
        },
        [props.store, toggleDeleteModal, toggleRenameModal]
    );

    return (
        <Dropdown
            items={actions}
            wrapperClasses="!static"
            menuButton={
                <Menu.Button>
                    <EllipsisHorizontalIcon className="h-6 w-6 text-white absolute right-2 top-2" />
                </Menu.Button>
            }
            onSelectItem={handleDropdownSelection}
            menuClassNames="border-0"
            menuItemsClasses="z-50 shadow-md top-6 left-0 md:right-[-100%]"
        />
    );
};
