"use client";

import { useState } from "react";
import { Input, Textarea, Select, SelectItem, Image } from "@nextui-org/react";
import { fetchDashboardSearchProductProps, OptionProps } from "@/app/lib/definitions";
import { CategoryProps } from "@/app/lib/definitions";
import EditCheackdOptions from "@/app/ui/dashboard/control/options";

export default function EditProductForm({
  product,
  category,
  option,
}: {
  product: fetchDashboardSearchProductProps;
  category: CategoryProps;
  option: OptionProps;
}) {
  return (
    <>
      <div>
        <h3 className="my-2">製品ID</h3>
        <Input
          isDisabled
          type="text"
          label="製品IDは変更することができません"
          defaultValue={product.productId}
          className="w-[220px]"
        />
      </div>
      <div>
        <h3 className="my-2">製品名</h3>
        <Input
          type="text"
          label="製品名を入力してください"
          value={product.name}
          placeholder="Product Name"
          className="max-w-xs"
        />
      </div>
      <div>
        <h3 className="my-2">サムネイル画像</h3>
        <Image width={200} alt="NextUI hero Image" src={`/assets/${product.images[0].thumbnailUrl}`} />
      </div>
      <div>
        <h3 className="my-2">価格</h3>
        <Input
          type="text"
          label="価格を入力してください"
          value={String(product.price)}
          placeholder="Product Price"
          className="w-[150px]"
        />
      </div>

      <div>
        <h3 className="my-2">カテゴリ</h3>
        <Select
          label="カテゴリを選択してください"
          placeholder="Product Category"
          defaultSelectedKeys={[product.category.name]}
          className="max-w-xs"
        >
          {category.map((item, key) => (
            <SelectItem key={item.name}>{item.name}</SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <h3 className="my-2">内容</h3>
        <Textarea
          label="製品の内容を入力してください"
          minRows={6}
          value={product.description || ""}
          placeholder=""
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3>オプション</h3>
        <EditCheackdOptions option={option} />
      </div>
    </>
  );
}
