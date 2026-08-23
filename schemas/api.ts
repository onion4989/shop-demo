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

/**
 * 管理者商品検索API用のバリデーションスキーマ
 */
export const AdminProductSearchSchema = z.object({
  keyword: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  priceRange: z
    .enum(["ALL", "UNDER_500", "BETWEEN_500_999", "BETWEEN_1000_1999", "OVER_2000"])
    .optional()
    .default("ALL"),
  giftAvailable: z.boolean().optional().default(false),
  seasonal: z.boolean().optional().default(false),
  bulkPurchase: z.boolean().optional().default(false),
  frozenDelivery: z.boolean().optional().default(false),
  couponAvailable: z.boolean().optional().default(false),
  shippingAvailable: z.boolean().optional().default(false),
  reservationRequired: z.boolean().optional().default(false),
  recommendedOnly: z.boolean().optional().default(false),
});

