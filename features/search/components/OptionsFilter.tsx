// features/search/components/OptionsFilter.tsx
"use client";

import React, { useState } from "react";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function CheackdOptions() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  function handleOptionsChange(values: string[]) {
    setSelectedValues(values);
    const params = new URLSearchParams(searchParams);

    if (values.length > 0) {
      params.set("options", values.join(","));
    } else {
      params.delete("options");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  // ここにSelectItemの値を e.targtで 取得

  return (
    <CheckboxGroup label="オプション" value={selectedValues} onChange={handleOptionsChange} className="">
      <Checkbox value="giftAvailable">ギフト対応</Checkbox>
      <Checkbox value="seasonal">季節限定</Checkbox>
      <Checkbox value="bulkPurchase">まとめ買い対象</Checkbox>
      <Checkbox value="frozenDelivery">冷凍配送</Checkbox>
      <Checkbox value="couponAvailable">クーポン可</Checkbox>
      <Checkbox value="shippingAvailable">配送可</Checkbox>
      <Checkbox value="reservationRequired">予約制</Checkbox>
    </CheckboxGroup>
  );
}
