// features/search/components/PriceFilter.tsx
"use client";

import React, { useMemo } from "react";
import { Select, SelectItem } from "@heroui/select";
import type { Selection } from "@react-types/shared";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const price = [
  { key: "500", label: "500" },
  { key: "1000", label: "1000" },
  { key: "1500", label: "1500" },
];

export default function SelectPrice() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // 現在のURLのpriceパラメータを反映
  const selectedKeys = useMemo<Selection>(() => {
    const v = searchParams.get("price");
    return v ? new Set([v]) : new Set([]);
  }, [searchParams]);

  // 選択変更時にURLクエリを更新
  const handleSelectionChange = (keys: Selection) => {
    const val = Array.from(keys as Set<string>)[0] ?? "";
    const params = new URLSearchParams(searchParams);

    if (val) {
      params.set("price", val);
    } else {
      params.delete("price");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      label="価格帯"
      className="max-w-xs"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
      selectionMode="single"
      disallowEmptySelection={false}
    >
      {price.map((item) => (
        <SelectItem key={item.key}>{item.label}</SelectItem>
      ))}
    </Select>
  );
}
