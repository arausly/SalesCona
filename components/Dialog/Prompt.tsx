import { Button } from "@components/Button";
import { Modal } from "./Dialog";

interface PromptProps {
    isOpen: boolean;
    toggleModal: () => void;
    action: () => void;
    actionMsg: string;
    title: string;
    contentMsg: string;
    actionWorking?: boolean;
}

export const Prompt = ({
    toggleModal,
    isOpen,
    action,
    title,
    contentMsg,
    actionMsg,
    actionWorking
}: PromptProps) => {
    return (
        <Modal
            dialogClassName="z-50"
            title={title}
            isOpen={isOpen}
            toggleModal={toggleModal}
        >
            <div className="flex flex-col w-full mt-2">
                <p className="mb-2 text-sm font-light">{contentMsg}</p>
            </div>
            <div className="mt-4 flex items-center justify-end">
                <button
                    type="button"
                    className="mr-3 inline-flex justify-center shadow-md rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none ease-in-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={toggleModal}
                >
                    No, take me back
                </button>
                <Button
                    className="mr-3 z-50 inline-flex justify-center shadow-md rounded-md border border-transparent bg-[#D83F31] hover:bg-[#C70039] px-4 py-2 text-sm font-medium text-white focus:outline-none ease-in-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    type="button"
                    onClick={action}
                    loading={actionWorking}
                    text={`Yes, ${actionMsg}`}
                    loadingText="working..."
                />
            </div>
        </Modal>
    );
};
