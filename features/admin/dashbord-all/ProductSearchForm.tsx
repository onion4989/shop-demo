// features/admin/dashbord-all/ProductSearchForm.tsx
"use client";

import type {
  AdminCategoryOption,
  AdminProductSearchOptions,
} from "@/lib/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type Props = {
  categories: AdminCategoryOption[];
  value: AdminProductSearchOptions;
  onChange: (value: AdminProductSearchOptions) => void;
};

export function ProductSearchForm({ categories, value, onChange }: Props) {
  const handleChange = (patch: Partial<AdminProductSearchOptions>) => {
    onChange({ ...value, ...patch });
  };

  const handleReset = () => {
    onChange({
      keyword: "",
      categoryId: null,
      priceRange: "ALL",
      giftAvailable: false,
      seasonal: false,
      bulkPurchase: false,
      frozenDelivery: false,
      couponAvailable: false,
      shippingAvailable: false,
      reservationRequired: false,
      recommendedOnly: false,
    });
  };

  return (
    <form
      className="space-y-4 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {/* 1段目: 検索ワード / カテゴリ / 価格帯 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 検索ワード */}
        <div className="space-y-1">
          <Label htmlFor="keyword">検索ワード</Label>
          <Input
            id="keyword"
            placeholder="商品名・商品IDで検索"
            value={value.keyword}
            onChange={(e) => handleChange({ keyword: e.target.value })}
          />
        </div>

        {/* カテゴリ */}
        <div className="space-y-1">
          <Label>カテゴリ</Label>
          <Select
            value={value.categoryId ?? "ALL"}
            onValueChange={(val) =>
              handleChange({ categoryId: val === "ALL" ? null : val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">すべて</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.categoryId}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 価格帯 */}
        <div className="space-y-1">
          <Label>価格帯</Label>
          <Select
            value={value.priceRange}
            onValueChange={(val) =>
              handleChange({
                priceRange: val as AdminProductSearchOptions["priceRange"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="価格帯を選択" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">すべて</SelectItem>
              <SelectItem value="UNDER_500">〜 ¥500</SelectItem>
              <SelectItem value="BETWEEN_500_999">¥500〜¥999</SelectItem>
              <SelectItem value="BETWEEN_1000_1999">¥1,000〜¥1,999</SelectItem>
              <SelectItem value="OVER_2000">¥2,000〜</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2段目: オプション */}
      <div className="border-t pt-3">
        <Label className="block mb-2">オプション</Label>

        <div className="grid grid-cols-3 gap-3 text-xs sm:grid-cols-6">
          <OptionCheckbox
            label="ギフト対応"
            checked={value.giftAvailable}
            onCheckedChange={(checked) =>
              handleChange({ giftAvailable: checked })
            }
          />
          <OptionCheckbox
            label="季節限定"
            checked={value.seasonal}
            onCheckedChange={(checked) => handleChange({ seasonal: checked })}
          />
          <OptionCheckbox
            label="まとめ買い対象"
            checked={value.bulkPurchase}
            onCheckedChange={(checked) =>
              handleChange({ bulkPurchase: checked })
            }
          />
          <OptionCheckbox
            label="冷凍配送"
            checked={value.frozenDelivery}
            onCheckedChange={(checked) =>
              handleChange({ frozenDelivery: checked })
            }
          />
          <OptionCheckbox
            label="クーポン可"
            checked={value.couponAvailable}
            onCheckedChange={(checked) =>
              handleChange({ couponAvailable: checked })
            }
          />
          <OptionCheckbox
            label="配送可"
            checked={value.shippingAvailable}
            onCheckedChange={(checked) =>
              handleChange({ shippingAvailable: checked })
            }
          />
          <OptionCheckbox
            label="予約制"
            checked={value.reservationRequired}
            onCheckedChange={(checked) =>
              handleChange({ reservationRequired: checked })
            }
          />
          <OptionCheckbox
            label="おすすめ商品のみ"
            checked={value.recommendedOnly}
            onCheckedChange={(checked) =>
              handleChange({ recommendedOnly: checked })
            }
          />
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            条件クリア
          </Button>
        </div>
      </div>
    </form>
  );
}

type OptionCheckboxProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function OptionCheckbox({
  label,
  checked,
  onCheckedChange,
}: OptionCheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <Checkbox
        checked={checked}
        onCheckedChange={(val:any) => onCheckedChange(Boolean(val))}
      />
      <span>{label}</span>
    </label>
  );
}
