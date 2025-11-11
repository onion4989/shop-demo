// app/(home)/search/clientSearch.tsx
"use client";

import React, { useEffect, useRef } from "react";
import useSWR, { mutate as swrMutate } from "swr";
import { useSearchParams } from "next/navigation";
import Spinner from "@/app/ui/spinner";
import SearchFroms from "@/app/(home)/search/forms";
import ResultsTable from "@/app/ui/search/result";
import HitNumber from "@/app/ui/search/hit";

/** 型定義 */
type Product = {
  productId: string;
  name: string;
  category: { name: string };
  images: { thumbnailUrl: string }[];
  price: number;
  option?: any;
};
type ApiResponse = { products: Product[]; total: number };

/** SWR fetcher */
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const norm = (v: string | null) =>
  v && v !== "undefined" && v !== "null" ? v : "";

/** 検索クライアント */
export default function ClientSearch() {
  const params = useSearchParams();

  // 現在の条件（URLと同期）
  const query = norm(params.get("query"));
  const category = norm(params.get("category"));
  const price = norm(params.get("price"));
  const options = norm(params.get("options"));

  // クエリ文字列生成（空なら /api/search で全件）
  const qs: string[] = [];
  if (query) qs.push(`query=${encodeURIComponent(query)}`);
  if (category) qs.push(`category=${encodeURIComponent(category)}`);
  if (price) qs.push(`price=${encodeURIComponent(price)}`);
  if (options) qs.push(`options=${encodeURIComponent(options)}`);
  const key = qs.length ? `/api/search?${qs.join("&")}` : `/api/search`;

  // SWR：前データ保持でチラつき軽減
  const { data, error, isLoading } = useSWR<ApiResponse>(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  // 事前プリフェッチ（体感速度UPの一例）
  useEffect(() => {
    const preKeys = [
      "/api/search?price=500",
      "/api/search?price=1000",
      "/api/search?price=1500",
    ];
    preKeys.forEach((k) => swrMutate(k, fetcher(k), { revalidate: false }));
  }, []);

  // SWR v1向けの fallbackData 用キャッシュ（任意）
  {/*const lastDataRef = useRef<ApiResponse | undefined>();
  useEffect(() => {
    if (data) lastDataRef.current = data;
  }, [data]);*/}

  return (
    <>
      <div className="grid grid-cols-12 gap-6 my-24">
        <div className="col-span-10 grid grid-cols-4 gap-4">
          <SearchFroms />
        </div>
        <div className="col-span-2">
          {/*isLoading ? (
            <Spinner />
          ) : (
            <HitNumber max={data?.total || 0} search={data?.products?.length || 0} />
          )*/}
          <HitNumber max={data?.total || 0} search={data?.products?.length || 0} />
        </div>
      </div>

      <div>
        {/*isLoading ? <Spinner /> : <ResultsTable result={data?.products || []} />*/}
        <ResultsTable result={data?.products || []} />
      </div>
    </>
  );
}
