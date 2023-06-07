"use client";
import React from "react";
import { useGetLastPathname } from "@hooks/useGetLastPathname";
import { ProductListPage } from "../components/ProductListPage";

import products from "@data/products.json";

export default function ProductsByCategory() {
    const category = useGetLastPathname();

    const [categoryProducts] = React.useState(() =>
        products.products.filter((p) => p.category === category)
    );

    return <ProductListPage products={categoryProducts} />;
}
