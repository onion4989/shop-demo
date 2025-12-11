// features/admin/dashbord-all/ProductListRow.tsx
"use client";

import Image from "next/image";
import { useTransition } from "react";

import type { AdminProductListItem } from "@/lib/types";
import { EditButton } from "@features/admin/components/AdminButton";
import { Button } from "@/components/ui/button";
// import { deleteProduct } from "@/lib/server/admin/actions/deleteProduct"; // 実装済みなら利用

type Props = {
  product: AdminProductListItem;
};

export function ProductListRow({ product }: Props) {
  const [isPending /*, startTransition*/] = useTransition();

  const handleDelete = async () => {
    const ok = window.confirm(
      `商品ID: ${product.productId}\n「${product.name}」を削除してもよろしいですか？`,
    );
    if (!ok) return;

    // 実際に削除アクションを呼びたい場合
    // startTransition(async () => {
    //   await deleteProduct(product.productId);
    // });
  };

  const isRecommended = product.recommend > 0;

  return (
    <div className="
      grid grid-cols-8 items-center 
      gap-4 
      px-4 py-3 
      border-b border-dashed border-gray-300 
      text-sm 
      text-center
    ">
      {/* 商品ID */}
      <p className="truncate font-mono text-xs text-gray-700">
        {product.productId}
      </p>

      {/* サムネイル (80x80) */}
      <div className="flex justify-center">
        {product.thumbnailUrl ? (
          <div className="relative w-[80px] h-[80px] overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={`/assets/${product.thumbnailUrl}`}
              alt={product.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <span className="text-xs text-gray-400">No Image</span>
        )}
      </div>

      {/* カテゴリ */}
      <p className="truncate text-gray-700">{product.categoryName}</p>

      {/* 商品名 */}
      <p className="truncate text-gray-900 text-left pl-2">{product.name}</p>

      {/* 価格 */}
      <p className="truncate text-gray-900 pl-2">{product.price}</p>

      {/* おすすめ */}
      <div className="flex justify-center">
        {isRecommended ? (
          <span
            className="
              inline-flex items-center whitespace-nowrap 
              rounded-full 
              bg-[#EC3F9C]/10 
              text-[#EC3F9C] 
              px-2 py-1 
              text-[10px] 
              font-semibold
            "
          >
            {product.recommend > 1 && (
              <span className="ml-1 text-[10px] text-[#EC3F9C]/80">
                (優先度 {product.recommend})
              </span>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-400 px-3 py-1 text-xs">
            -
          </span>
        )}
      </div>

      {/* 編集 */}
      <div className="flex justify-center">
        <EditButton productid={product.productId} />
      </div>

      {/* 削除 */}
      <div className="flex justify-center">
        <Button
          type="button"
          size="sm"
          variant="destructive"
          className="min-w-[80px]"
          onClick={handleDelete}
          disabled={isPending}
        >
          削除
        </Button>
      </div>
    </div>
  );
}
