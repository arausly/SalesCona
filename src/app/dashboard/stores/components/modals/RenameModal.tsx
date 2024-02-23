import React from "react";
import { Modal } from "@components/Dialog/Dialog";
import { useBrowserSupabase } from "@lib/supabaseBrowser";
import { StoreContext } from "../StoreList";
import { useGetUser } from "@hooks/useGetUser";
import { toast } from "react-toastify";
import { debounce } from "@lib/common.utils";
import { spaceSeparatedStrToPath } from "@lib/format-utils";
import { Button } from "@components/Button";
import {
    renameStore,
    storeWithNameExist
} from "@services/stores/stores.service";

interface RenameModalProps {
    isOpen: boolean;
    toggleModal: () => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
    isOpen,
    toggleModal
}) => {
    const [newName, setNewName] = React.useState<string>("");
    const [errorMsg, setErrorMessage] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const { supabase } = useBrowserSupabase();
    const { currentStore, refreshStores } = React.useContext(StoreContext);
    const { user } = useGetUser();

    const handleStoreRename = React.useCallback(async () => {
        try {
            setLoading(true);
            if (!user || !currentStore || !newName.length) return;
            const { error } = await renameStore({
                name: newName,
                slug: spaceSeparatedStrToPath(newName),
                userId: user.id,
                storeId: currentStore.id
            });
            if (error) {
                setErrorMessage(
                    "Had issues updating the store name, please try again"
                );
            } else {
                refreshStores();
                toggleModal();
                setNewName("");
                toast(<p className="text-sm">Store rename successful!</p>, {
                    type: "success"
                });
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }, [user, currentStore, newName]);

    const checkIfStoreExist = React.useCallback(
        debounce(async (storeName: string) => {
            try {
                if (!user) return;
                const { data } = await storeWithNameExist({
                    userId: user.id,
                    storeName,
                    slug: spaceSeparatedStrToPath(storeName)
                });

                setErrorMessage(
                    data?.length
                        ? "Already exist, please rename to something else"
                        : ""
                );
            } catch (err) {}
        }, 500),
        [user]
    );

    const handleStoreNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setNewName(val);
            checkIfStoreExist(val);
        },
        [user]
    );

    return (
        <Modal title="Rename store" isOpen={isOpen} toggleModal={toggleModal}>
            <div className="flex flex-col w-full mt-2">
                <p className="mb-2 text-sm">
                    What new name would you like to call it:
                </p>
                <input
                    type="text"
                    id="table-search"
                    placeholder={currentStore?.name ?? "New store name"}
                    value={newName}
                    onChange={handleStoreNameChange}
                    className={`${
                        errorMsg
                            ? "border border-red-500 outline-none"
                            : "border border-gray-200"
                    } block p-2 pl-10 text-sm text-black w-full rounded-md`}
                />
                {errorMsg && (
                    <p className="text-red-500 text-xs mt-1">{errorMsg}</p>
                )}
            </div>
            <div className="mt-4 flex items-center justify-end">
                <button
                    type="button"
                    className="mr-3 inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none ease-in-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={toggleModal}
                >
                    No, thanks
                </button>
                <Button
                    type="button"
                    loading={loading}
                    text="Yes, rename"
                    loadingText="Renaming..."
                    className="inline-flex justify-center rounded-md border border-transparent primary-bg px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleStoreRename}
                />
            </div>
        </Modal>
    );
};
