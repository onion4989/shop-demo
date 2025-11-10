"use client";

import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { CategoryProps } from "@/app/lib/definitions";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SelectCategory({ category }: { category: CategoryProps }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleCategoryChange(item: string) {
    const params = new URLSearchParams(searchParams);
    if (item) {
      params.set("category", item);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  // ここにSelectItemの値を e.targtで 取得

  return (
    <Select label="カテゴリ" className="max-w-xs" onChange={(e) => handleCategoryChange(e.target.value)}>
      {category?.map((item) => (
        <SelectItem key={item.categoryId} value={item.categoryId}>
          {item.name}
        </SelectItem>
      ))}
    </Select>
  );
}
