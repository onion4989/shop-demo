// features/catalog/Loaders.ts
import type { LoadResult } from "@lib/server/loadResult";
import { prisma } from "@lib/server/prisma"; // 既に用意済みの Prisma シングルトン
import { unstable_cache } from "next/cache";
import { cache } from "react";

// ✅ 商品詳細：IDごとにキャッシュ（栄養も含め 1 クエリ）
export function getProductDetailCached(productId: string) {
  return unstable_cache(
    async () => {
      return prisma.product.findUnique({
        where: { productId },
        select: {
          productId: true,
          name: true,
          price: true,
          description: true,
          category: { select: { name: true, categoryId: true } },
          images: {
            select: {
              thumbnailUrl: true,
              imageUrl_1: true,
              imageUrl_2: true,
              imageUrl_3: true,
              imageUrl_4: true,
              imageUrl_5: true,
              imageUrl_6: true,
            },
          },
          nutritionalInfo: {
            select: {
              energy: true,
              protein: true,
              fat: true,
              carbohydrates: true,
              saltEquivalent: true,
              allergen: true,
            },
          },
        },
      });
    },
    ["product-detail-with-nutri", productId],
    { revalidate: 300 }
  )();
}

export type ProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductDetailCached>>
>;

export type ProductNutriRow = ProductDetail["nutritionalInfo"][number];

// Top / Hero 共用: recommend 上位。同一リクエスト内は React cache で 1 回にまとめる
export const getTopProducts = cache(async function getTopProducts(
  limit = 9,
): Promise<LoadResult<Awaited<ReturnType<typeof fetchTopProducts>>>> {
  try {
    const data = await unstable_cache(
      () => fetchTopProducts(limit),
      ["top-products", "ranked", "with-category", String(limit)],
      { revalidate: 300 },
    )();
    return { ok: true, data };
  } catch (error) {
    console.error("[getTopProducts]", error);
    return { ok: false, reason: "unavailable" };
  }
});

export type TopProduct = Awaited<ReturnType<typeof fetchTopProducts>>[number];

function fetchTopProducts(limit: number) {
  return prisma.product.findMany({
    take: limit,
    where: { recommend: { gt: 0 } },
    orderBy: { recommend: "asc" },
    select: {
      id: true,
      productId: true,
      name: true,
      price: true,
      recommend: true,
      description: true,
      category: { select: { name: true } },
      images: { select: { thumbnailUrl: true } },
      nutritionalInfo: { select: { ingredients: true } },
      option: {
        select: {
          giftAvailable: true,
          seasonal: true,
          bulkPurchase: true,
          frozenDelivery: true,
          couponAvailable: true,
          shippingAvailable: true,
          reservationRequired: true,
        },
      },
    },
  });
}
