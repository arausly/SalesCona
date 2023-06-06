import Image from "next/image";
import { CustomerProduct } from "../typing";

//dummy image
import shirt from "@assets/images/shirts.webp";

interface ProductCardProps {
    product: CustomerProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="flex flex-col h-80 w-60 rounded-md shadow-md overflow-hidden">
            {/** product image box */}
            <div className="h-2/3 bg-gray-50 rounded-t-md relative cursor-pointer">
                <Image
                    src={shirt}
                    alt="product"
                    className="object-contain transition duration-300 ease-in-out hover:scale-105"
                />
                {product.discount && (
                    <span className="absolute top-2 left-2 inline-flex rounded-md flex items-center justify-center bg-red-500 py-1 px-2">
                        <p className="text-white text-sm">
                            -{product.discount}%
                        </p>
                    </span>
                )}
            </div>
            <div className="bg-white h-1/3"></div>
        </div>
    );
};
