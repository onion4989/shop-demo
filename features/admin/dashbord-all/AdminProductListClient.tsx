// features/admin/dashbord-all/AdminProductListClient.tsx
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import Spinner from "@features/ui/spinner";
import { ProductSearchForm } from "./ProductSearchForm";
import { ProductList } from "./ProductList";

import type {
  AdminCategoryOption,
  AdminProductListItem,
  AdminProductSearchOptions,
  AdminProductSearchResponse,
} from "@/lib/types";

const defaultSearchOptions: AdminProductSearchOptions = {
  keyword: "",
  categoryId: null,
  priceRange: "ALL",
  giftAvailable: false,
  seasonal: false,
  bulkPurchase: false,
  frozenDelivery: false,
  couponAvailable: false,
  recommendedOnly: false,
};

const fetcher = async (
  [_, body]: [string, AdminProductSearchOptions],
): Promise<AdminProductSearchResponse> => {
  const res = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // エラーレスポンスの詳細を取得
    let errorMessage = "商品一覧の取得に失敗しました。";
    try {
      const errorData = await res.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // JSONパースに失敗した場合はデフォルトメッセージを使用
    }

    // 401エラーの場合は認証エラーとして扱う
    if (res.status === 401) {
      throw new Error("認証が必要です。ログインしてください。");
    }

    throw new Error(errorMessage);
  }

  return (await res.json()) as AdminProductSearchResponse;
};

type Props = {
  initialTotalCount: number;
  categories: AdminCategoryOption[];
};

export function AdminProductListClient({
  initialTotalCount,
  categories,
}: Props) {
  const [searchOptions, setSearchOptions] =
    useState<AdminProductSearchOptions>(defaultSearchOptions);

  const swrKey = useMemo<[string, AdminProductSearchOptions]>(
    () => ["admin-products", searchOptions],
    [searchOptions],
  );

  const { data, isLoading, error } = useSWR<AdminProductSearchResponse>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  const totalCount = data?.totalCount ?? initialTotalCount;
  const filteredCount = data?.filteredCount ?? 0;
  const products: AdminProductListItem[] = data?.products ?? [];

  return (
    <div className="space-y-4">
      {/* 検索フォーム + 情報パネル */}
      <div className="flex gap-4">
        <div className="col-span-7 bg-white rounded-lg p-4 shadow-sm">
          <ProductSearchForm
            categories={categories}
            value={searchOptions}
            onChange={setSearchOptions}
          />
        </div>

        <div className="flex-auto bg-white rounded-lg p-4 shadow-sm grid justify-items-stretch">
          <div>
            <p className="font-semibold text-gray-700">検索結果</p>
            <span className="text-2xl font-bold text-[#EC3F9C]">
              {isLoading && !data ? "..." : `${filteredCount}`}
            </span>
            <span>件</span>
          </div>
          <div className="border-t pt-3">
            <p className="font-semibold text-gray-700 mb-1">総商品数</p>
            <span className="text-2xl font-bold text-[#EC3F9C]">
            {totalCount}
            </span>
            <span>件</span>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center justify-center text-gray-700">
        <div className="mx-4">
          <span className="font-semibold">検索結果</span>
          <span className="text-2xl font-bold text-[#EC3F9C]">
            {isLoading && !data ? "..." : `${filteredCount}`}
          </span>
          <span>件</span>
        </div>
        <div>
          <span className="font-semibold">総商品数</span>
          <span className="text-2xl font-bold text-[#EC3F9C]">
            {totalCount}
          </span>
          <span>件</span>
        </div>
      </div> */}

      {/* 一覧ヘッダー */}
      <div className="grid grid-cols-8 gap-4 bg-white rounded-t-lg py-3 px-4 text-center text-sm font-semibold border-b border-gray-200">
        <div>商品ID</div>
        <div>サムネイル</div>
        <div>カテゴリ</div>
        <div>商品名</div>
        <div>価格</div>
        <div>おすすめ</div>
        <div>編集</div>
        <div>削除</div>
      </div>

      {/* 一覧本体 */}
      <div className="bg-white rounded-b-lg shadow-sm border border-gray-200">
        {isLoading && !data ? (
          <div className="p-6">
            <Spinner />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-500">
            商品一覧の取得中にエラーが発生しました。
          </div>
        ) : products.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            該当する商品は見つかりませんでした。
          </p>
        ) : (
          <ProductList products={products} />
        )}
      </div>
    </div>
  );
}
