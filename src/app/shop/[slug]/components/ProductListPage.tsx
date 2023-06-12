import { SearchField } from "@components/Input/SearchField";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";
import { SortBy } from "./SortBy";
import { CustomerProduct } from "../typing";

interface ProductListProps {
    products: Array<CustomerProduct>;
}

export const ProductListPage: React.FC<ProductListProps> = ({ products }) => {
    return (
        <div className="flex justify-center p-6 px-12 gap-10">
            <div className="w-max">
                <CategoryFilter />
            </div>
            <div className="flex-1 flex flex-col items-center">
                <div className="w-2/5 shadow-sm">
                    <SearchField placeholder="Search products..." />
                </div>
                <div className="mt-8 flex gap-4 justify-center flex-wrap">
                    {products.map((product) => (
                        <ProductCard key={product.product} product={product} />
                    ))}
                </div>
            </div>
            <div className="w-max">
                <SortBy />
            </div>
        </div>
    );
};
