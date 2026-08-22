// /features/admin/components/ProductRegisterForm.tsx
"use client";

import {
  useState,
  useTransition,
  useEffect,
  type KeyboardEvent,
  type FocusEvent,
} from "react";
import Link from "next/link";
import {
  useForm,
  type Control,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ProductRegisterSchema,
  type ProductRegisterFormValues,
} from "@/schemas/Index";
import { registerProduct } from "@/lib/server/admin/actions/registerProduct";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormError } from "@/components/error";
import { FormSuccess } from "@/components/success";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";

import { RegistrationPopupCard } from "@/features/admin/components/shared/RegistrationPopupCard";
import { ExternalLink } from "lucide-react";

// 必須バッジコンポーネント（px-2 py-1 に統一）
const RequiredBadge = () => (
  <span
    className="
      ml-1 
      inline-flex items-center 
      rounded 
      bg-[#E4007E] 
      px-2 py-1 
      text-[10px] 
      font-semibold 
      text-white 
      align-middle
    "
  >
    必須
  </span>
);

// 任意バッジ
const OptionalBadge = () => (
  <span
    className="
      ml-1 
      inline-flex items-center 
      rounded 
      bg-sky-500/75 
      px-2 py-1 
      text-[10px] 
      font-semibold 
      text-white 
      align-middle
    "
  >
    任意
  </span>
);

type Category = {
  id: number;
  categoryId: string; // 接頭辞 (例: CUP, ICE)
  name: string;
};

type ProductRegisterFormProps = {
  categories: Category[];
};

// 画像入力フィールド名
type ImageFieldName =
  | "thumbnailUrl"
  | "imageUrl_1"
  | "imageUrl_2"
  | "imageUrl_3"
  | "imageUrl_4"
  | "imageUrl_5"
  | "imageUrl_6";

// 一つの画像フィールド用のコンポーネント
type ImageFileFieldProps = {
  name: ImageFieldName;
  label: string;
  required?: boolean;
  optional?: boolean;
  disabled: boolean;
  control: Control<ProductRegisterFormValues>;
  resetKey: number; // クリア時にプレビューもリセットするためのキー
};

// 商品登録履歴用
type RegisteredProduct = {
  productId: string;
  name: string;
  categoryId: string;
  createdAt: string;
};

function ImageFileField({
  name,
  label,
  required,
  optional,
  disabled,
  control,
  resetKey,
}: ImageFileFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // resetKey が変わったらローカル状態もリセット
  useEffect(() => {
    setPreviewUrl(null);
    setFileName("");
  }, [resetKey]);

  return (
    <FormField<ProductRegisterFormValues>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {/* ラベル */}
          <FormLabel className="inline-flex items-center gap-1 text-sm font-medium">
            {label}
            {required && <RequiredBadge />}
            {optional && !required && <OptionalBadge />}
          </FormLabel>

          <FormControl>
            <div className="my-2 space-y-2">
              {/* Hidden input */}
              <input
                key={resetKey}
                type="file"
                id={name}
                accept="image/*"
                disabled={disabled}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    field.onChange(file.name);
                    setFileName(file.name);
                    setPreviewUrl(URL.createObjectURL(file));
                  } else {
                    field.onChange("");
                    setFileName("");
                    setPreviewUrl(null);
                  }
                }}
              />

              {/* Styled button */}
              <label
                htmlFor={name}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-muted px-3 py-2 text-xs shadow-sm transition hover:bg-accent hover:text-accent-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 5v9m0 0l-3-3m3 3l3-3M5 19h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                画像を選択
              </label>

              {/* File name */}
              {fileName && (
                <p className="text-xs text-muted-foreground">
                  選択中: {fileName}
                </p>
              )}

              {/* Preview */}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={label}
                  className="h-24 w-24 rounded-md object-cover"
                />
              )}
            </div>
          </FormControl>

          {/* フィールドエラー */}
          <FormMessage className="mt-1 text-[10px] text-[#E4007E]" />
        </FormItem>
      )}
    />
  );
}

export function ProductRegisterForm({ categories }: ProductRegisterFormProps) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // ポップアップ用
  const [popup, setPopup] = useState<RegisteredProduct | null>(null);

  // 登録履歴（この画面での操作分のみ）
  const [history, setHistory] = useState<RegisteredProduct[]>([]);

  // 画像リセット用キー
  const [resetKey, setResetKey] = useState(0);

  // ポップアップを一定時間表示（ここでは 6000ms）
  useEffect(() => {
    if (!popup) return;
    const timer = setTimeout(() => setPopup(null), 6000);
    return () => clearTimeout(timer);
  }, [popup]);

  const defaultValues: ProductRegisterFormValues = {
    name: "",
    price: 0,
    description: "",
    categoryId: categories[0]?.categoryId ?? "",
    thumbnailUrl: "",
    imageUrl_1: "",
    imageUrl_2: "",
    imageUrl_3: "",
    imageUrl_4: "",
    imageUrl_5: "",
    imageUrl_6: "",
    giftAvailable: false,
    seasonal: false,
    bulkPurchase: false,
    frozenDelivery: false,
    couponAvailable: false,
    recommend: 0,
  };

  const form = useForm<ProductRegisterFormValues>({
    resolver: zodResolver(ProductRegisterSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<ProductRegisterFormValues> = (values) => {
    setError("");
    setSuccess("");

    const normalized: ProductRegisterFormValues = {
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      recommend: Number(values.recommend),
    };

    startTransition(() => {
      registerProduct(normalized).then((result) => {
        if (result?.error) {
          setError(result.error);
        }
        if (result?.success && result.productId) {
          const registered: RegisteredProduct = {
            productId: result.productId,
            name: normalized.name,
            categoryId: normalized.categoryId,
            createdAt: new Date().toLocaleString(),
          };

          setSuccess(result.success);
          setPopup(registered);
          setHistory((prev) => [registered, ...prev].slice(0, 10));

          // 入力値 & 画像プレビューリセット
          form.reset(defaultValues);
          setResetKey((prev) => prev + 1);
        }
      });
    });
  };

  // 価格入力で「半角数字のみ」を許可
  const handlePriceKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Home",
      "End",
      "Enter",
    ];

    if (allowedKeys.includes(e.key)) return;
    if (/^[0-9]$/.test(e.key)) return;

    e.preventDefault();
  };

  // フォーカス時にデフォルトの「0」を全選択して、入力しやすくする
  const handlePriceFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "0") {
      e.target.select();
    }
  };

  return (
    <>
      {/* ポップアップ */}
      {popup && (
        <RegistrationPopupCard
          title="商品を登録しました"
          lines={[
            { label: "商品ID", value: popup.productId },
            { label: "商品名", value: popup.name },
            { label: "カテゴリID", value: popup.categoryId },
          ]}
          timestamp={popup.createdAt}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            商品情報入力
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* カテゴリ */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="w-[160px]">
                      <FormLabel className="inline-flex items-center gap-1 text-sm font-medium">
                        カテゴリ
                        <RequiredBadge />
                      </FormLabel>
                      <div className="my-2 flex items-end gap-2">
                        <FormControl>
                          <Select
                            disabled={isPending}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="カテゴリを選択してください" />
                            </SelectTrigger>
                            <SelectContent className="border border-border bg-white">
                              {categories.map((cat) => (
                                <SelectItem
                                  key={cat.id}
                                  value={cat.categoryId}
                                  className="cursor-pointer"
                                >
                                  {`${cat.name}（${cat.categoryId}）`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                          className="whitespace-nowrap cursor-pointer bg-cyan-500 text-white hover:bg-cyan-600 hover:text-white"
                          disabled={isPending}
                        >
                          <Link
                            href="/dashboard/category-regist"
                            className="flex items-center gap-1"
                          >
                            <span>カテゴリ登録</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                      <FormMessage className="mt-1 text-[10px] text-[#E4007E]" />
                    </FormItem>
                  )}
                />

                {/* 商品名 */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-[50%] max-w-xl">
                      <FormLabel className="inline-flex items-center gap-1 text-sm font-medium">
                        商品名
                        <RequiredBadge />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="例: チョコミントカップケーキ"
                          disabled={isPending}
                          className="my-2 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-[10px] text-[#E4007E]" />
                    </FormItem>
                  )}
                />

                {/* 価格 */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-[50%] max-w-xl">
                      <FormLabel className="inline-flex items-center gap-1 text-sm font-medium">
                        価格（税込）
                        <RequiredBadge />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          disabled={isPending}
                          className="my-2 w-full"
                          {...field}
                          onKeyDown={handlePriceKeyDown}
                          onFocus={handlePriceFocus}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value || 0))
                          }
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-[10px] text-[#E4007E]" />
                    </FormItem>
                  )}
                />

                {/* 画像設定 */}
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold">画像設定</h2>
                  <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    <p>画像パス運用ガイド:</p>
                    <p>・商品画像は <code>public/assets/common/items/</code> に配置してください。</p>
                    <p>・このフォームでは画像の「ファイル名」を保存します（例: <code>cup0001_item_xxx.jpg</code>）。</p>
                    <p>・先頭ページ用画像（<code>public/assets/pages/top/</code>）はこのフォームの対象外です。</p>
                  </div>

                  {/* サムネイル（必須） */}
                  <ImageFileField
                    name="thumbnailUrl"
                    label="サムネイル画像"
                    required
                    disabled={isPending}
                    control={form.control}
                    resetKey={resetKey}
                  />

                  {/* 追加画像 */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["imageUrl_1", "追加画像 1"],
                        ["imageUrl_2", "追加画像 2"],
                        ["imageUrl_3", "追加画像 3"],
                        ["imageUrl_4", "追加画像 4"],
                        ["imageUrl_5", "追加画像 5"],
                        ["imageUrl_6", "追加画像 6"],
                      ] as [ImageFieldName, string][]
                    ).map(([name, label]) => (
                      <ImageFileField
                        key={name}
                        name={name}
                        label={label}
                        optional
                        disabled={isPending}
                        control={form.control}
                        resetKey={resetKey}
                      />
                    ))}
                  </div>
                </div>

                {/* オプション設定 */}
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold">オプション設定</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* ギフト対応 */}
                    <FormField
                      control={form.control}
                      name="giftAvailable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(!!checked)
                              }
                              disabled={isPending}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              ギフト対応
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              ギフト包装・贈答に対応している場合にチェックします。
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* 季節限定 */}
                    <FormField
                      control={form.control}
                      name="seasonal"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(!!checked)
                              }
                              disabled={isPending}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              季節限定
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              期間限定・季節商品の場合にチェックします。
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* まとめ買い対象 */}
                    <FormField
                      control={form.control}
                      name="bulkPurchase"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(!!checked)
                              }
                              disabled={isPending}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              まとめ買い対象
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              セット販売・複数購入対象商品の場合にチェックします。
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* 冷凍配送 */}
                    <FormField
                      control={form.control}
                      name="frozenDelivery"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(!!checked)
                              }
                              disabled={isPending}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              冷凍配送
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              冷凍での配送に対応している場合にチェックします。
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* クーポン可 */}
                    <FormField
                      control={form.control}
                      name="couponAvailable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(!!checked)
                              }
                              disabled={isPending}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              クーポン可
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              クーポンの対象商品であればチェックします。
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* おすすめ順位 */}
                <FormField
                  control={form.control}
                  name="recommend"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel className="inline-flex items-center gap-1 text-sm font-medium">
                        おすすめ順位
                        <RequiredBadge />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          disabled={isPending}
                          className="my-2 w-32"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value || 0))
                          }
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-[10px] text-[#E4007E]" />
                    </FormItem>
                  )}
                />

                {/* 商品説明 */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="max-w-xl">
                      <FormLabel className="inline-flex items-center gap-1 text-sm font-medium">
                        商品説明
                        <RequiredBadge />
                      </FormLabel>
                      <FormControl>
                        <textarea
                          className="
                            my-2 
                            flex 
                            min-h-[120px] 
                            w-full 
                            rounded-md 
                            border border-input 
                            bg-background 
                            px-3 
                            py-2 
                            text-sm 
                            ring-offset-background 
                            placeholder:text-muted-foreground 
                            focus-visible:outline-none 
                            focus-visible:ring-2 
                            focus-visible:ring-ring 
                            focus-visible:ring-offset-2 
                            disabled:cursor-not-allowed 
                            disabled:opacity-50
                          "
                          placeholder="商品の特徴やこだわりなどを入力してください。"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-[10px] text-[#E4007E]" />
                    </FormItem>
                  )}
                />

                {/* メッセージ表示 */}
                <FormError message={error} />
                <FormSuccess message={success} />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className="cursor-pointer"
                    onClick={() => {
                      form.reset(defaultValues);
                      setResetKey((prev) => prev + 1); // 画像もクリア
                    }}
                  >
                    クリア
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="cursor-pointer"
                  >
                    {isPending ? "登録中..." : "登録する"}
                  </Button>
                </div>
              </form>
            </Form>

            {/* 登録履歴 */}
            {history.length > 0 && (
              <div className="border-t pt-4">
                <h2 className="mb-3 text-sm font-semibold">
                  登録履歴（この画面での操作）
                </h2>
                <ul className="space-y-2 text-xs">
                  {history.map((item, index) => (
                    <li
                      key={`${item.productId}-${item.createdAt}-${index}`}
                      className="flex items-start justify-between rounded-md border bg-muted/40 px-3 py-2"
                    >
                      <div className="space-y-1">
                        <p>
                          <span className="font-semibold">商品ID：</span>
                          {item.productId}
                        </p>
                        <p>
                          <span className="font-semibold">商品名：</span>
                          {item.name}
                        </p>
                        <p>
                          <span className="font-semibold">カテゴリID：</span>
                          {item.categoryId}
                        </p>
                      </div>
                      <p className="ml-4 whitespace-nowrap text-[10px] text-muted-foreground">
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
