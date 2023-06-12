import { Modal } from "@components/Dialog/Dialog";
import { Rating } from "@components/Rating";

interface CustomerAlertFormProps {
    modalOpen: boolean;
    toggleModal: () => void;
}

export const CustomerReviewForm: React.FC<CustomerAlertFormProps> = ({
    modalOpen,
    toggleModal
}) => {
    return (
        <Modal
            title="We would love to get your feedback!"
            isOpen={modalOpen}
            toggleModal={toggleModal}
        >
            <div className="mt-2">
                <form className="flex flex-col mt-4">
                    <div className="flex flex-col mb-6">
                        <div className="flex mb-1">
                            <p className="mr-1">Rating</p>
                            <span className="text-[#6d67e4]">*</span>
                        </div>
                        <Rating
                            rating={1}
                            size="large"
                            isInteractive
                            handleRatingChange={() => {}}
                        />
                    </div>
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
                            <p className="mr-1">Comment</p>
                            <span className="text-[#6d67e4]">*</span>
                        </div>
                        <textarea
                            id="table-search"
                            onChange={() => {}}
                            placeholder="I love your product!"
                            className="block p-2 pl-10 text-sm text-black border border-gray-300 w-full rounded-md"
                        />
                    </div>
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent transition  bg-[#6d67e4] hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={toggleModal}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </Modal>
    );
};
