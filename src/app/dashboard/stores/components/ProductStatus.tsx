import { Product } from "../typing";

export const ProductStatus = ({
    status
}: {
    status: "published" | "draft";
}) => {
    return (
        <div
            className={`${
                status === "draft" ? "bg-gray-200" : "bg-green-200"
            }  w-fit h-8 flex px-4 justify-between rounded-md items-center`}
        >
            <span
                className={`${
                    status === "draft" ? "bg-gray-800" : "bg-green-800"
                } h-2 w-2 rounded-full  mr-4`}
            />
            <p
                className={`${
                    status === "draft" ? "text-gray-800" : "text-green-800"
                } `}
            >
                {status}
            </p>
        </div>
    );
};
