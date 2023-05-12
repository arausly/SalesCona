import { Modal } from "@components/Dialog/Dialog";

interface RenameModalProps {
    isOpen: boolean;
    toggleModal: () => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
    isOpen,
    toggleModal,
}) => {
    return (
        <Modal title="Rename store" isOpen={isOpen} toggleModal={toggleModal}>
            <div className="flex flex-col w-full mt-2">
                <p className="mb-2 text-sm">
                    What new name would you like to call it:
                </p>
                <input
                    type="text"
                    id="table-search"
                    placeholder="New store name"
                    className="block p-2 pl-10 text-sm text-black border border-gray-200 w-full rounded-md"
                />
            </div>
            <div className="mt-4 flex items-center justify-end">
                <button
                    type="button"
                    className="mr-3 inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none ease-in-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={toggleModal}
                >
                    No, thanks
                </button>
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent primary-bg px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={toggleModal}
                >
                    Yes, rename
                </button>
            </div>
        </Modal>
    );
};
