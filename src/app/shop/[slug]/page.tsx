//dummy data
import products from "@data/products.json";
import { ProductListPage } from "./components/ProductListPage";

export default function Shop() {
    return <ProductListPage products={products.products} />;
}
