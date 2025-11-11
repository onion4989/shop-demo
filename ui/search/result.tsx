// app/ui/search/result.tsx
"use client";

import React, { forwardRef } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import ProductDesignCard from "@/app/components/card/card";
import type { SearchProductsProps } from "@/app/lib/definitions";

/**
 * 仮想化されたグリッド一覧
 * - react-virtuoso の VirtuosoGrid を使用
 * - CSS Grid でレスポンシブな列数を制御（2/3/6列）
 * - 高さの異なるカードにも対応（自動測定）
 */
export default function ResultsTable({ result }: { result: SearchProductsProps[] }) {
  if (!result || result.length === 0) return <p>該当なし</p>;

  return (
    <VirtuosoGrid
      data={result}
      useWindowScroll
      overscan={300} // 少し先まで描画して体感を滑らかに
      components={{
        // グリッド本体（レスポンシブ列）
        List: GridList,
        // 各セルのラッパー（余白とサイズ安定用）
        Item: GridItem,
      }}
      itemContent={(index, item) => (
        <div className="w-full h-full">
          <ProductDesignCard
            id={index + 1}
            productid={item.productId}
            name={item.name}
            category={item.category.name}
            price={item.price}
            img={item.images?.[0]?.thumbnailUrl}
          />
        </div>
      )}
    />
  );
}

/** グリッド本体（CSS Grid） */
const GridList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      style={style}
      {...props}
      className="
        grid gap-6
        grid-cols-2 md:grid-cols-3 lg:grid-cols-6
        items-stretch
      "
    >
      {children}
    </div>
  )
);
GridList.displayName = "GridList";

/** 各アイテムの外枠（パディング/高さ安定用） */
const GridItem = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className="
      w-full h-full
      [contain:content]
    "
  >
    {children}
  </div>
);
