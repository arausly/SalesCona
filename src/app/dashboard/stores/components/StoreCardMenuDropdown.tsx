"use client";
import React, { ReactNode } from "react";
import Dropdown from "@components/Menudrown";
import { Menu } from "@headlessui/react";
import {
    EllipsisHorizontalIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { StoreContext } from "./StoreList";

interface StoreCardMenuProps {}

const actions = [
    { label: "Rename", icon: PencilIcon },
    { label: "Delete", icon: TrashIcon },
];
export const StoreCardMenuDropdown: React.FC<StoreCardMenuProps> = (props) => {
    const { toggleDeleteModal, toggleRenameModal } =
        React.useContext(StoreContext);

    const handleDropdownSelection = React.useCallback(
        (item: string) => {
            if (item === "Rename") {
                toggleRenameModal();
            }
            if (item == "Delete") {
                toggleDeleteModal();
            }
        },
        [toggleDeleteModal, toggleRenameModal]
    );

    return (
        <Dropdown
            items={actions}
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
