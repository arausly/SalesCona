import { Modal } from "@components/Dialog/Dialog";

interface CustomerAlertFormProps {
    modalOpen: boolean;
    toggleModal: () => void;
}

export const CustomerAlertForm: React.FC<CustomerAlertFormProps> = ({
    modalOpen,
    toggleModal
}) => {
    return (
        <Modal
            title="Be the first to hear of exclusive deals!"
            isOpen={modalOpen}
            toggleModal={toggleModal}
        >
            <div className="mt-2">
                <p className="text-sm text-gray-500">
                    When promos, discounts and clearance sales offers are
                    available you will be the first to know!
                </p>
                <form className="flex flex-col mt-4">
                    <div className="flex flex-col mb-6">
                        <div className="flex mb-1">
                            <p className="mr-1">Full name</p>
                            <span className="text-[#6d67e4]">*</span>
                        </div>
                        <p className="text-xs font-light mb-1">
                            40 characters max
                        </p>
                        <input
                            type="text"
                            id="table-search"
                            onChange={() => {}}
                            placeholder="Christine Davidson"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                        />
                    </div>
                    <div className="flex flex-col mb-7">
                        <div className="flex mb-1">
                            <p className="mr-1">Email</p>
                            <span className="text-[#6d67e4]">*</span>
                        </div>
                        <input
                            type="email"
                            id="table-search"
                            onChange={() => {}}
                            placeholder="christine.davidson@anymail.com"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                        />
                    </div>
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent transition  bg-[#6d67e4] hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={toggleModal}
                    >
                        Notify me!
                    </button>
                </form>
            </div>
        </Modal>
    );
};
