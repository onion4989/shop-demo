// /home/takashi_ogawa/shop-demo/schemas/Index.ts
import * as z from "zod";

// ...（Password, Reset, Login, Register, Category はそのまま）...
// Password Reset
export const NewPasswordSchema = z.object({
  //email: z.string().min(1, "メールアドレスは必須です。").email("無効なメールアドレスです。"),
  password: z
    .string()
    .min(1, "パスワードは必須です。")
    .min(8, "パスワードは8文字以上で入力してください。")
    .regex(/[A-Z]/, "大文字を含めてください。")
    .regex(/[a-z]/, "小文字を含めてください。")
    .regex(/[0-9]/, "数字を含めてください。"),
});

// Reset
export const ResetSchema = z.object({
  email: z.string().min(1, "メールアドレスは必須です。").email("無効なメールアドレスです。"),
});

// Login
export const LoginSchema = z.object({
  email: z.string().min(1, "メールアドレスは必須です。").email("無効なメールアドレスです。"),
  password: z.string().min(1, "パスワードは必須です。"),
  // 2段階認証フィールド
  code: z
    .string()
    .length(6, { message: "6桁のコードを入力してください。" })
    .optional()
    .or(z.literal("")), // 空文字も許可
});

// Register
export const RegisterSchema = z
  .object({
    name: z.string().min(1, "ユーザー名は必須です。"),
    email: z.string().min(1, "メールアドレスは必須です。").email("無効なメールアドレスです。"),
    password: z
      .string()
      .min(1, "パスワードは必須です。")
      .min(8, "パスワードは8文字以上で入力してください。")
      .regex(/[A-Z]/, "大文字を含めてください。")
      .regex(/[a-z]/, "小文字を含めてください。")
      .regex(/[0-9]/, "数字を含めてください。"),
    confirmPassword: z.string().min(1, "確認用パスワードは必須です。"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "パスワードが一致しません。",
  });

// Category
export const CategoryRegisterSchema = z.object({
  categoryId: z
    .string()
    .min(1, "カテゴリIDは必須です")
    .regex(/^[A-Za-z]+$/, "カテゴリIDは英字のみで入力してください"),
  name: z.string().min(1, "カテゴリ名は必須です"),
});
export type CategoryRegisterInput = z.infer<typeof CategoryRegisterSchema>;

// === Product 用スキーマ ===
export const ProductRegisterSchema = z.object({
  // productId は自動採番するのでフォームからは受け取らない
  name: z.string().min(1, "商品名は必須です"),
  price: z
    .number({ invalid_type_error: "価格は数値で入力してください" })
    .nonnegative("0以上の値を入力してください"),
  description: z.string().min(1, "商品説明は必須です"),

  // カテゴリは Category テーブルの categoryId をセレクトで選ぶ
  categoryId: z.string().min(1, "カテゴリは必須です"),

  // 画像関連
  thumbnailUrl: z.string().min(1, "サムネイル画像は必須です"),
  imageUrl_1: z.string().optional(),
  imageUrl_2: z.string().optional(),
  imageUrl_3: z.string().optional(),
  imageUrl_4: z.string().optional(),
  imageUrl_5: z.string().optional(),
  imageUrl_6: z.string().optional(),

  // オプション設定（複数選択可）
  // default(false) により「入力型」は boolean | undefined、「出力型」は boolean になる
  giftAvailable: z.boolean().default(false),
  seasonal: z.boolean().default(false),
  bulkPurchase: z.boolean().default(false),
  frozenDelivery: z.boolean().default(false),
  couponAvailable: z.boolean().default(false),

  recommend: z
    .number({ invalid_type_error: "おすすめ順位は数値で入力してください" })
    .int("整数で入力してください")
    .min(0, "0以上で入力してください"),
});

// ★ フォーム用（入力型）: resolver / useForm / FormField はこちらを使う
export type ProductRegisterFormValues = z.input<typeof ProductRegisterSchema>;

// ★ safeParse 後のデータ型（出力型）: Prisma に渡す型などはこちらを使う
export type ProductRegisterInput = z.infer<typeof ProductRegisterSchema>;
