// features/catalog/Loaders.ts
import { unstable_cache } from "next/cache";
import { prisma } from "@lib/server/prisma"; // 既に用意済みの Prisma シングルトン

// ✅ 商品詳細：IDごとにキャッシュ
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
        },
      });
    },
    ["product-detail", productId],
    { revalidate: 300 }
  )();
}

// ✅ 管理画面の編集詳細：IDごとにキャッシュ
export function getDashboardProductCached(productId: string) {
  return unstable_cache(
    async () => {
      return prisma.product.findUnique({
        where: { productId },
        select: {
          productId: true,
          name: true,
          price: true,
          description: true,
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
          category: { select: { name: true, categoryId: true } },
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
    },
    ["dashboard-product", productId],
    { revalidate: 300 }
  )();
}

// ✅ オプション：IDごとにキャッシュ
export function getOptionsCached(productId: string) {
  return unstable_cache(
    async () => {
      return prisma.option.findUnique({
        where: { productId },
        select: {
          giftAvailable: true,
          seasonal: true,
          bulkPurchase: true,
          frozenDelivery: true,
          couponAvailable: true,
          shippingAvailable: true,
          reservationRequired: true,
        },
      });
    },
    ["product-options", productId],
    { revalidate: 300 }
  )();
}

// ✅ 栄養情報：IDごとにキャッシュ
export function getNutritionalInfoCached(productId: string) {
  return unstable_cache(
    async () => {
      return prisma.nutritionalInfo.findUnique({
        where: { productId },
      });
    },
    ["product-nutri", productId],
    { revalidate: 300 }
  )();
}

// 参考）トップ用は引数（limit）で結果が変わるので、limit もキーに含める
export function getTopProducts(limit = 9) {
  return unstable_cache(
    () => prisma.product.findMany({
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
    }),
    ["top-products", "ranked", String(limit)],
    { revalidate: 300 }
  )();
}

// ✅ カテゴリ一覧：固定データなので固定キーでOK（5〜10分程度で十分）
export function getCategoriesCached() {
  return unstable_cache(
    async () => {
      return prisma.category.findMany({
        select: { id: true, categoryId: true, name: true },
        orderBy: { name: "asc" },
      });
    },
    ["categories"],
    { revalidate: 600 } // 10分
  )();
}