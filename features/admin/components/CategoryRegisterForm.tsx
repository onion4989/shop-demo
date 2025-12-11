// /features/admin/components/CategoryRegisterForm.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CategoryRegisterSchema,
  type CategoryRegisterInput,
} from "@/schemas/Index";
import { registerCategory } from "@/lib/server/admin/actions/registerCategory";
import { RegistrationPopupCard } from "@/features/admin/components/shared/RegistrationPopupCard";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormError } from "@/components/error";
import { FormSuccess } from "@/components/success";
import { BeatLoader } from "react-spinners";
import { CheckCircle2 } from "lucide-react";

type RegisteredCategory = {
  categoryId: string;
  name: string;
  createdAt: string;
};

export function CategoryRegisterForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // ポップアップ用
  const [popup, setPopup] = useState<RegisteredCategory | null>(null);

  // 登録履歴（この画面での操作分のみ）
  const [history, setHistory] = useState<RegisteredCategory[]>([]);

  // ポップアップを最低 5 秒以上表示（ここでは 6000ms）
  useEffect(() => {
    if (!popup) return;
    const timer = setTimeout(() => setPopup(null), 6000);
    return () => clearTimeout(timer);
  }, [popup]);

  const form = useForm<CategoryRegisterInput>({
    resolver: zodResolver(CategoryRegisterSchema),
    defaultValues: {
      categoryId: "",
      name: "",
    },
  });

  const onSubmit = (values: CategoryRegisterInput) => {
    setError("");
    setSuccess("");

    const normalized: CategoryRegisterInput = {
      ...values,
      categoryId: values.categoryId.trim(),
      name: values.name.trim(),
    };

    startTransition(() => {
      registerCategory(normalized).then((result) => {
        if (result?.error) {
          setError(result.error);
        }
        if (result?.success && result.category) {
          const registered: RegisteredCategory = {
            categoryId: result.category.categoryId,
            name: result.category.name,
            createdAt: new Date().toLocaleString(), // ログ表示用
          };

          setSuccess(result.success);
          setPopup(registered);

          // 最新が先頭に来るように履歴を更新（最大 10 件などに制限してもよい）
          setHistory((prev) => [registered, ...prev].slice(0, 10));

          form.reset({
            categoryId: "",
            name: "",
          });
        }
      });
    });
  };

  return (
    <>
      {/* === 右上のポップアップカード === */}
      {popup && (
        <RegistrationPopupCard
          title="カテゴリを登録しました"
          lines={[
            { label: "カテゴリID", value: popup.categoryId },
            { label: "カテゴリ名", value: popup.name },
          ]}
          timestamp={popup.createdAt}
        />
      )}

      {/* === 入力フォーム + 登録履歴 === */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            カテゴリ情報入力
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* 入力フォーム */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* カテゴリID（接頭辞） */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        カテゴリID（接頭辞）
                        <span className="text-xs text-muted-foreground ml-1">
                          例: CUP, ICE（英字のみ / 自動的に大文字で保存）
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="例: CUP"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* カテゴリ名 */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>カテゴリ名</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="例: カップケーキ"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* メッセージ表示 */}
                <FormError message={error} />
                <FormSuccess message={success} />

                {/* 登録ボタン（Loader付き） */}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => form.reset()}
                  >
                    クリア
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <BeatLoader size={8} /> : "登録"}
                  </Button>
                </div>
              </form>
            </Form>

            {/* 登録履歴ログ */}
            {history.length > 0 && (
              <div className="border-t pt-4">
                <h2 className="text-sm font-semibold mb-3">
                  登録履歴（この画面での操作）
                </h2>
                <ul className="space-y-2 text-xs">
                  {history.map((item, index) => (
                    <li
                      key={`${item.categoryId}-${item.createdAt}-${index}`}
                      className="flex items-start justify-between rounded-md border bg-muted/40 px-3 py-2"
                    >
                      <div className="space-y-1">
                        <p>
                          <span className="font-semibold">カテゴリID：</span>
                          {item.categoryId}
                        </p>
                        <p>
                          <span className="font-semibold">カテゴリ名：</span>
                          {item.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground ml-4 whitespace-nowrap">
                        {item.createdAt}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
