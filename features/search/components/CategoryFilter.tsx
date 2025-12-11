// features/search/components/CategoryFilter.tsx
"use client";

import React, { useMemo, useCallback, useTransition } from "react";
import { Select, SelectItem } from "@heroui/select";
import type { Selection } from "@react-types/shared";
import { CategoryProps } from "@lib/types";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

/**
 * カテゴリ選択コンポーネント
 * - NextUI v2 対応
 * - useTransition で非ブロッキング遷移
 * - scroll:false で画面が再描画時にスクロールしない
 */
export default function SelectCategory({ category }: { category: CategoryProps }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // URLパラメータから現在のカテゴリを反映
  const selectedKeys = useMemo<Selection>(() => {
    const current = searchParams.get("category");
    // "undefined" や "null" を防止
    return current && current !== "undefined" && current !== "null"
      ? new Set([current])
      : new Set([]);
  }, [searchParams]);

  // カテゴリ変更時の処理
  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      const val = Array.from(keys as Set<string>)[0] ?? "";
      const params = new URLSearchParams(searchParams);

      if (val) {
        params.set("category", val);
      } else {
        params.delete("category");
      }

      // 非ブロッキングにルーター更新（スクロールなし）
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [replace, pathname, searchParams]
  );

  return (
    <Select
      label="カテゴリ"
      className="max-w-xs"
      selectionMode="single"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
      disallowEmptySelection={false}
      isDisabled={isPending} // 遷移中は入力を一時無効化（UX向上）
    >
      {category?.map((item) => (
        <SelectItem key={item.categoryId}>
          {item.name}
        </SelectItem>
      ))}
    </Select>
  );
}
