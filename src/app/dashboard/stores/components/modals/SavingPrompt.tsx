import { Modal } from "@components/Dialog/Dialog";

interface PublishingPromptProps {
    isOpen: boolean;
}

export const SavingPrompt: React.FC<PublishingPromptProps> = ({ isOpen }) => {
    return (
        <Modal
            title=""
            isOpen={isOpen}
            toggleModal={() => {}}
            dialogClassName="z-50"
            dialogPanelClassName="bg-[#FFD495] rounded-none"
        >
            <div className="mt-4 flex items-center">
                <p className="text-sm mr-2">
                    Please do not close this page, currently working
                </p>
                <svg
                    className="animate-spin h-5 w-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        d="M12 2a10 10 0 0 1 0 20"
                    ></path>
                </svg>
            </div>
        </Modal>
    );
};
