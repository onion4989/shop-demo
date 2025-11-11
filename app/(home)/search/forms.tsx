// app/(home)/search/forms.tsx
"use client";

import useSWR from "swr";
import InputTerm from "@/app/ui/control/term";
import SelectCategory from "@/app/ui/control/category";
import SelectPrice from "@/app/ui/control/price";
import CheackdOptions from "@/app/ui/control/options";
import Spinner from "@/app/ui/spinner";

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
