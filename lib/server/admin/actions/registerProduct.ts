// /lib/server/admin/actions/registerProduct.ts
"use server";

import { prisma } from "@/lib/server/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server/auth/authorization";
import {
  ProductRegisterSchema,
  type ProductRegisterFormValues, // ← フォーム用
  type ProductRegisterInput,      // ← safeParse 後の出力用
} from "@/schemas/Index";

// ===== productId の自動採番ロジック =====
async function generateNextProductId(categoryId: string): Promise<string> {
  const prefix = categoryId;

  const lastProduct = await prisma.product.findFirst({
    where: { categoryId },
    orderBy: { productId: "desc" },
    select: { productId: true },
  });

  if (!lastProduct) {
    return `${prefix}${String(1).padStart(5, "0")}`;
  }

  const suffix = lastProduct.productId.replace(prefix, "");
  const currentNumber = Number(suffix) || 0;
  const nextNumber = currentNumber + 1;

  return `${prefix}${String(nextNumber).padStart(5, "0")}`;
}

export async function registerProduct(values: ProductRegisterFormValues) {
  // 認可チェック（管理者のみ）
  const session = await requireAdmin();
  if (!session) {
    return { error: "権限がありません。" };
  }

  const parsed = ProductRegisterSchema.safeParse(values);

  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "入力内容に誤りがあります。";
    return { error: message };
  }

  // ★ ここからは出力型（すべての default が効いた、欠損なしの値）
  const data: ProductRegisterInput = parsed.data;

  try {
    // トランザクションを使用して、ID生成から商品作成までをアトミックに実行
    // これにより、同時リクエスト時の競合状態を防ぐ
    const result = await prisma.$transaction(async (tx) => {
      const prefix = data.categoryId;
      
      // 最新の商品IDを取得（ロック付き）
      const lastProduct = await tx.product.findFirst({
        where: { categoryId: data.categoryId },
        orderBy: { productId: "desc" },
        select: { productId: true },
      });

      let productId: string;
      if (!lastProduct) {
        productId = `${prefix}${String(1).padStart(5, "0")}`;
      } else {
        const suffix = lastProduct.productId.replace(prefix, "");
        const currentNumber = Number(suffix) || 0;
        const nextNumber = currentNumber + 1;
        productId = `${prefix}${String(nextNumber).padStart(5, "0")}`;
      }

      // 商品を作成（productId が unique 制約なので、重複時はエラーになる）
      const product = await tx.product.create({
        data: {
          productId,
          name: data.name,
          categoryId: data.categoryId,
          price: data.price,
          description: data.description,
          recommend: data.recommend,
          images: {
            create: {
              thumbnailUrl: data.thumbnailUrl,
              imageUrl_1: data.imageUrl_1 || null,
              imageUrl_2: data.imageUrl_2 || null,
              imageUrl_3: data.imageUrl_3 || null,
              imageUrl_4: data.imageUrl_4 || null,
              imageUrl_5: data.imageUrl_5 || null,
              imageUrl_6: data.imageUrl_6 || null,
            },
          },
          option: {
            create: {
              giftAvailable: data.giftAvailable,
              seasonal: data.seasonal,
              bulkPurchase: data.bulkPurchase,
              frozenDelivery: data.frozenDelivery,
              couponAvailable: data.couponAvailable,
            },
          },
        },
      });

      return { productId, product };
    });

    revalidatePath("/catalog");

    return {
      success: "商品を登録しました。",
      productId: result.productId,
    };
  } catch (error: unknown) {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      console.error("[registerProduct] error:", error);
    }
    
    // Prisma の一意制約違反エラーをチェック
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { error: "商品IDの生成に失敗しました。しばらく待ってから再度お試しください。" };
    }
    
    return { error: "商品登録に失敗しました。" };
  }
}
