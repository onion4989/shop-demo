// app/ui/dashboard/control/options.tsx
"use client";

import React, { useState } from "react";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { OptionProps } from "@lib/types";

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
      <Checkbox value="giftAvailable" color="danger">
        <span className="text-white">ギフト対応</span>
      </Checkbox>
      <Checkbox value="seasonal" color="danger">
        <span className="text-white" color="danger">
          季節限定
        </span>
      </Checkbox>
      <Checkbox value="bulkPurchase" color="danger">
        <span className="text-white">まとめ買い対象</span>
      </Checkbox>
      <Checkbox value="frozenDelivery" color="danger">
        <span className="text-white">冷凍配送</span>
      </Checkbox>
      <Checkbox value="couponAvailable" color="danger">
        <span className="text-white">クーポン可</span>
      </Checkbox>
      <Checkbox value="shippingAvailable" color="danger">
        <span className="text-white">配送可</span>
      </Checkbox>
      <Checkbox value="reservationRequired" color="danger">
        <span className="text-white">予約制</span>
      </Checkbox>
    </CheckboxGroup>
  );
}
