// features/admin/dashbord-all/ProductList.tsx
"use client";

import { Virtuoso } from "react-virtuoso";
import type { AdminProductListItem } from "@/lib/types";
import { ProductListRow } from "./ProductListRow";

type Props = {
  products: AdminProductListItem[];
};

export function ProductList({ products }: Props) {
  return (
    <div>
      <Virtuoso
        data={products}
        useWindowScroll
        overscan={400}
        itemContent={(_, item) => (
          <ProductListRow key={item.id} product={item} />
        )}
      />
    </div>
  );
}
