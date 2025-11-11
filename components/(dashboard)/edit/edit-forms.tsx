// app/components/(dashboard)/edit/edit-forms.tsx
"use client";

import { Input, Textarea, Select, SelectItem, Image } from "@nextui-org/react";
import type { FetchDashboardSearchProductProps, OptionProps, CategoryProps } from "@/lib/definitions";
import EditCheackdOptions from "@/ui/dashboard/control/options";

export default function EditProductForm({
  product,
  category,
  option,
}: {
  product: FetchDashboardSearchProductProps;
  category: CategoryProps;
  option: OptionProps;
}) {
  return (
    <>
      <div>
        <h3 className="my-2">製品ID</h3>
        <Input isDisabled type="text" label="製品IDは変更できません" defaultValue={product.productId} className="w-[220px]" />
      </div>

      <div>
        <h3 className="my-2">製品名</h3>
        <Input
          type="text"
          label="製品名を入力してください"
          defaultValue={product.name}
          name="name"
          className="max-w-xs"
        />
      </div>

      <div>
        <h3 className="my-2">サムネイル画像</h3>
        <Image width={200} alt={product.name} src={`/assets/${product.images[0].thumbnailUrl}`} />
      </div>

      <div>
        <h3 className="my-2">価格</h3>
        <Input
          type="number"
          label="価格を入力してください"
          defaultValue={String(product.price)}
          name="price"
          className="w-[150px]"
          min={0}
          step="1"
          inputMode="numeric"
        />
      </div>

      <div>
        <h3 className="my-2">カテゴリ</h3>
        <Select
          label="カテゴリを選択してください"
          defaultSelectedKeys={[product.category.categoryId]}
          name="categoryId"
          className="max-w-xs"
          selectionMode="single"
        >
          {category.map((c) => (
            <SelectItem key={c.categoryId} value={c.categoryId}>
              {c.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <h3 className="my-2">内容</h3>
        <Textarea
          label="製品の内容を入力してください"
          minRows={6}
          defaultValue={product.description || ""}
          name="description"
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

