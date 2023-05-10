import React, { ReactNode } from "react";
//test data
import stores from "@data/stores.json";
import { StoreCard } from "./StoreCard";
import { useGetStoreImage } from "../hooks/useGetStoreImage";
import { RenameModal } from "./modals/RenameModal";
import { DeleteModal } from "./modals/DeleteModal";

interface StoreContextType {
    renameModalIsOpen: boolean;
    deleteModalIsOpen: boolean;
    toggleRenameModal: () => void;
    toggleDeleteModal: () => void;
}

const NOP = () => {};

export const StoreContext = React.createContext<StoreContextType>({
    renameModalIsOpen: false,
    deleteModalIsOpen: false,
    toggleDeleteModal: NOP,
    toggleRenameModal: NOP,
});

const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [renameModalIsOpen, setRenameModalOpen] =
        React.useState<boolean>(false);
    const [deleteModalIsOpen, setDeleteModalOpen] =
        React.useState<boolean>(false);

    const toggleRenameModal = React.useCallback(() => {
        setRenameModalOpen((s) => !s);
    }, []);

    const toggleDeleteModal = React.useCallback(() => {
        setDeleteModalOpen((s) => !s);
    }, []);

    const value = {
        renameModalIsOpen,
        deleteModalIsOpen,
        toggleRenameModal,
        toggleDeleteModal,
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
    const storeCoverImages = useGetStoreImage(stores.entries.length);

    return (
        <StoreProvider>
            {stores.entries.map((store, i) => (
                <StoreCard
                    key={store.url}
                    store={store}
                    img={(storeCoverImages ?? [])[i]}
                />
            ))}
        </StoreProvider>
    );
};
