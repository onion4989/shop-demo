// features/search/components/SearchForm.tsx
"use client";

import useSWR from "swr";
import InputTerm from "@features/search/components/TermFilter";
import SelectCategory from "@features/search/components/CategoryFilter";
import SelectPrice from "@features/search/components/PriceFilter";
import CheackdOptions from "@features/search/components/OptionsFilter";
import Spinner from "@features/ui/spinner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SearchFroms() {
  const { data, error, isLoading } = useSWR("/api/categories", fetcher, { revalidateOnFocus: false });

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500 text-sm">カテゴリ取得に失敗しました</p>;

  return (
    <>
      <div><InputTerm /></div>
      <div><SelectCategory category={data ?? []} /></div>
      <div><SelectPrice /></div>
      <div><CheackdOptions /></div>
    </>
  );
}
