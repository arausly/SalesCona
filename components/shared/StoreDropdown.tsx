import React from "react";

import Dropdown from "@components/Menudropdown";
import { StoreTable } from "@db/typing/store.typing";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

interface StoreDropdownProps {
    stores: StoreTable[];
    handleSelection: (store: StoreTable) => void;
}

export const StoreDropdown: React.FC<StoreDropdownProps> = ({
    stores,
    handleSelection
}) => {
    const formattedStores = React.useMemo(
        () => stores.map((s) => ({ ...s, label: s.name })),
        []
    );

    return (
        <Dropdown<StoreTable>
            titleIcon={
                <BuildingStorefrontIcon
                    className="ml-2 -mr-1 h-5 w-5 text-black mr-2"
                    aria-hidden="true"
                />
            }
            items={formattedStores}
            onSelectItem={handleSelection}
        />
    );
};
