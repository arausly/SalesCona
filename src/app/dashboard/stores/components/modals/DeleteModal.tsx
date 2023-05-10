import React from "react";
import { Modal } from "@components/Dialog/Dialog";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SUPPORT_EMAIL } from "@lib/constants";

interface DeleteModalProps {
    isOpen: boolean;
    toggleModal: () => void;
}

const textToConfirm = "placeholder-store-name";

export const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    toggleModal,
}) => {
    const [confirmedText, setConfirmedText] = React.useState<string>("");
    const isDisabled = confirmedText !== textToConfirm;
    return (
        <Modal title="Delete Store" isOpen={isOpen} toggleModal={toggleModal}>
            <div className="borer-t border-slate-100 mt-4">
                <div className="h-12 md:h-8 w-full p-2 flex items-center rounded-md bg-orange-200 border border-orange-300 mt-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                    <p className="ml-2 text-sm">
                        {"Unexpected things can happen if you don't read this"}
                    </p>
                </div>
                <div className="mt-2">
                    <p className="text-xs font-medium">
                        This will permanently delete products, categories,
                        promo, inventory, analytics, shop pages, affiliate links
                        etc. And cannot be restored ever again, only do this if
                        you are absolutely sure. if you have questions you can
                        contact{" "}
                        <a
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="text-xs text-blue-600"
                        >
                            {SUPPORT_EMAIL}
                        </a>
                    </p>
                </div>
            </div>
            <div className="w-full mt-4">
                <label className="text-sm mb-2 select-none">{`To confirm type "${textToConfirm}" in the box below`}</label>
                <input
                    type="text"
                    id="table-search"
                    placeholder=""
                    onChange={(e) => setConfirmedText(e.target.value)}
                    className={`block p-2 pl-10 text-sm text-black border w-full rounded-md ${
                        isDisabled
                            ? "focus:outline-none focus:border-red-600 focus:ring-red-600"
                            : "border-gray-400"
                    }`}
                />
                <button
                    type="button"
                    disabled={isDisabled}
                    className={`mt-4 w-full inline-flex justify-center rounded-md border border-transparent
                     px-4 py-2 text-sm font-medium text-white  focus:outline-none 
                     ease-in-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                         isDisabled
                             ? "bg-red-200 cursor-not-allowed"
                             : " bg-red-600 cursor-pointer hover:bg-red-700"
                     }`}
                    onClick={toggleModal}
                >
                    Delete store
                </button>
            </div>
        </Modal>
    );
};
