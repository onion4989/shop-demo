// app/ui/dashboard/control/options.tsx
"use client";

import React, { useState } from "react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { OptionProps } from "@/lib/definitions";

export default function EditCheackdOptions({ option }: { option: OptionProps }) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  function handleOptionsChange(values: string[]) {
    setSelectedValues(values);
  }

  const trueOptions = option
    ? Object.entries(option)
        .filter(([key, value]) => value) // 値が true のエントリーのみをフィルタリング
        .map(([key]) => key) // キーのみを取得
    : [];

  // ここにSelectItemの値を e.targtで 取得

  /* return <>{displayOptions}</>; */
  console.log(trueOptions);
  return (
    <CheckboxGroup label="" defaultValue={trueOptions} className=" text-white">
      <Checkbox value="takeoutAvailable" color="danger">
        <span className="text-white">テイクアウト可</span>
      </Checkbox>
      <Checkbox value="seasonal" color="danger">
        <span className="text-white" color="danger">
          季節限定
        </span>
      </Checkbox>
      <Checkbox value="bulkPurchase" color="danger">
        <span className="text-white">まとめ買い対象</span>
      </Checkbox>
      <Checkbox value="couponAvailable" color="danger">
        <span className="text-white">クーポン可</span>
      </Checkbox>
    </CheckboxGroup>
  );
}
