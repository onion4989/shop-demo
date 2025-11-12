// app/(admin)/dashboard/all/AdminAllClient.tsx
"use client";

import React from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import SearchFroms from "@/app/(home)/search/forms";
import Spinner from "@/ui/spinner";
import HitNumber from "@/ui/search/hit";
import { useSearchParams } from "next/navigation";
import { Virtuoso } from "react-virtuoso";
import { EditButton } from "@/ui/dashboard/control/button";

type Product = {
  productId: string;
  name: string;
  price: number;
  category: { name: string };
  images: { thumbnailUrl: string }[];
  option?: {
    takeoutAvailable: boolean;
    seasonal: boolean;
    bulkPurchase: boolean;
    couponAvailable: boolean;
  } | null;
};
type ApiResponse = { products: Product[]; total: number };

const norm = (v: string | null) => (v && v !== "undefined" && v !== "null" ? v : "");
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminAllClient() {
  const params = useSearchParams();
  const query = norm(params.get("query"));
  const category = norm(params.get("category"));
  const price = norm(params.get("price"));
  const options = norm(params.get("options"));

  const qs: string[] = [];
  if (query) qs.push(`query=${encodeURIComponent(query)}`);
  if (category) qs.push(`category=${encodeURIComponent(category)}`);
  if (price) qs.push(`price=${encodeURIComponent(price)}`);
  if (options) qs.push(`options=${encodeURIComponent(options)}`);
  const key = qs.length ? `/api/search?${qs.join("&")}` : `/api/search`;

  const { data, isLoading } = useSWR<ApiResponse>(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true, // ← キープリフェッチ：直前データを保持してチラつき0
  });

  const list = data?.products ?? [];

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-10 grid grid-cols-4 gap-4 bg-white p-4 rounded-lg">
          {/* 既存のユーザー向け検索フォームを流用（URLを更新） */}
          <SearchFroms />
        </div>
        <div className="col-span-2">
          {isLoading ? (
            <Spinner />
          ) : (
            <HitNumber max={data?.total || 0} search={list.length} />
          )}
        </div>
      </div>

      {/* ヘッダーは固定 */}
      <div className="mt-6 grid grid-cols-8 gap-4 bg-white rounded-lg py-3 text-center text-sm font-semibold">
        <div>商品ID</div>
        <div>サムネイル</div>
        <div>カテゴリ</div>
        <div>商品名</div>
        <div>価格</div>
        <div>オプション</div>
        <div>編集</div>
        <div>削除</div>
      </div>

      {/* 本体は仮想スクロール */}
      <div className="text-white border border-slate-700 rounded-lg mt-2">
        {isLoading ? (
          <div className="p-6"><Spinner /></div>
        ) : list.length === 0 ? (
          <p className="p-6">該当する対象製品は見つかりませんでした。</p>
        ) : (
          <Virtuoso
            data={list}
            useWindowScroll
            overscan={400}
            itemContent={(index, item) => (
              <Row item={item} />
            )}
          />
        )}
      </div>
    </>
  );
}

function Row({ item }: { item: Product }) {
  const opts =
    item.option
      ? [
          item.option.takeoutAvailable && "テイクアウト可",
          item.option.seasonal && "季節限定",
          item.option.bulkPurchase && "まとめ買い対象",
          item.option.couponAvailable && "クーポン可",
        ].filter(Boolean).join(" / ")
      : "-";

  return (
    <div
      className="grid grid-cols-8 items-center gap-4 py-3 border-b border-slate-700 text-center"
      key={`row_${item.productId}`}
    >
      <p className="truncate">{item.productId}</p>
      <p className="flex justify-center">
        {item.images?.[0]?.thumbnailUrl ? (
          <Image
            src={`/assets/${item.images[0].thumbnailUrl}`}
            alt={item.name}
            width={70}
            height={64}
            className="rounded-large"
            style={{ width: 70, height: 64 }}
            sizes="70px"
          />
        ) : (
          <span className="text-xs opacity-70">No Image</span>
        )}
      </p>
      <p className="truncate">{item.category?.name}</p>
      <p className="truncate">{item.name}</p>
      <p>￥{item.price}</p>
      <p className="truncate">{opts}</p>
      <p><EditButton productid={item.productId} /></p>
      <p><Link href={`/delete`} className="underline">削除</Link></p>
    </div>
  );
}
