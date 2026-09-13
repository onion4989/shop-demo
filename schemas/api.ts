// /home/takashi_ogawa/shop-demo/schemas/api.ts
// API Routes用のバリデーションスキーマ

import * as z from "zod";

/**
 * 検索API用のバリデーションスキーマ
 */
export const SearchQuerySchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  price: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "undefined" || val === "null") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "価格は0以上の数値で入力してください" }
    ),
  options: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val || "1", 10);
      return Math.max(1, num);
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val || "50", 10);
      return Math.min(100, Math.max(1, num));
    }),
});
