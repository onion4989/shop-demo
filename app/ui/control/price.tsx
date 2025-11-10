"use client";

import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
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

  function handlePriceChange(item: string) {
    const params = new URLSearchParams(searchParams);

    if (item) {
      params.set("price", item);
    } else {
      params.delete("price");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  // ここにSelectItemの値を e.targtで 取得

  return (
    <Select label="価格帯" className="max-w-xs" onChange={(e) => handlePriceChange(e.target.value)}>
      {price?.map((item) => (
        <SelectItem key={item.key} value={item.label}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
}
