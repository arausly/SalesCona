import { Product } from "../typing";

export const ProductStatus = ({ product }: { product: Product }) => {
    return (
        <div
            className={`${
                product.status === "Draft" ? "bg-gray-200" : "bg-green-200"
            }  w-fit h-8 flex px-4 justify-between rounded-md items-center`}
        >
            <span
                className={`${
                    product.status === "Draft" ? "bg-gray-800" : "bg-green-800"
                } h-2 w-2 rounded-full  mr-4`}
            />
            <p
                className={`${
                    product.status === "Draft"
                        ? "text-gray-800"
                        : "text-green-800"
                } `}
            >
                {product.status}
            </p>
        </div>
    );
};
