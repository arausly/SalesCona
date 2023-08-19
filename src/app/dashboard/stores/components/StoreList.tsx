import React, { ReactNode } from "react";

import { StoreCard } from "./StoreCard";
import { useGetStoreImage } from "../hooks/useGetStoreImage";
import { RenameModal } from "./modals/RenameModal";
import { DeleteModal } from "./modals/DeleteModal";
import { Store } from "../typing";
import { useGetStores } from "../hooks/useGetStores";

interface StoreContextType {
    renameModalIsOpen: boolean;
    deleteModalIsOpen: boolean;
    toggleRenameModal: () => void;
    toggleDeleteModal: () => void;
    currentStore?: Store;
    stores: Store[];
    refreshStores: () => void;
    searchStores: (query: string) => void;
    handleStoreSelection: (store: Store) => void;
    storeLoading: boolean;
}

const NOP = () => {};

export const StoreContext = React.createContext<StoreContextType>({
    renameModalIsOpen: false,
    deleteModalIsOpen: false,
    toggleDeleteModal: NOP,
    toggleRenameModal: NOP,
    stores: [],
    refreshStores: NOP,
    searchStores: NOP,
    handleStoreSelection: NOP,
    storeLoading: false
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [renameModalIsOpen, setRenameModalOpen] =
        React.useState<boolean>(false);
    const [deleteModalIsOpen, setDeleteModalOpen] =
        React.useState<boolean>(false);
    const [currentStore, setCurrentStore] = React.useState<Store>();
    const { stores, refreshStores, searchStores, storeLoading } =
        useGetStores();

    const toggleRenameModal = React.useCallback(() => {
        setRenameModalOpen((s) => !s);
    }, []);

    const toggleDeleteModal = React.useCallback(() => {
        setDeleteModalOpen((s) => !s);
    }, []);

    const handleStoreSelection = React.useCallback(
        (campaign: any = undefined) => {
            setCurrentStore(campaign);
        },
        []
    );

    const value = {
        renameModalIsOpen,
        deleteModalIsOpen,
        toggleRenameModal,
        toggleDeleteModal,
        handleStoreSelection,
        currentStore,
        stores,
        refreshStores,
        searchStores,
        storeLoading
    };

    return (
        <StoreContext.Provider value={value}>
            <RenameModal
                isOpen={renameModalIsOpen}
                toggleModal={toggleRenameModal}
            />
            <DeleteModal
                isOpen={deleteModalIsOpen}
                toggleModal={toggleDeleteModal}
            />
            {children}
        </StoreContext.Provider>
    );
};

export const StoreList = () => {
    const { stores } = React.useContext(StoreContext);
    const storeCoverImages = useGetStoreImage(stores.length);

    return (
        <>
            {stores.map((store, i) => (
                <StoreCard
                    key={store.id}
                    store={store}
                    img={(storeCoverImages ?? [])[i]}
                />
            ))}
        </>
    );
};
