import type { CartCatalogItem } from '@features/cart/types'
import { prisma } from '@lib/server/prisma'
import { resolveAssetPath } from '@lib/utils'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

/**
 * デモ想定の公開商品おおよそ上限。
 * 超えたら layout での全件カタログ渡し（本ファイル）を見直す。
 */
export const CART_CATALOG_SOFT_MAX = 100

/**
 * カート用カタログ（必要列のみ・全件）。
 * デモでは (main)/layout → CartShell に渡し、クライアントで productId を解決する。
 * カゴ内 ID だけの都度取得（4c）はしない。
 */
function fetchCartProducts() {
  return prisma.product.findMany({
    select: {
      productId: true,
      name: true,
      price: true,
      category: { select: { categoryId: true, name: true } },
      images: { select: { thumbnailUrl: true } },
      option: { select: { shippingAvailable: true } },
    },
  })
}

function toCartItems(
  products: Awaited<ReturnType<typeof fetchCartProducts>>,
): CartCatalogItem[] {
  return products.map((product) => ({
    productId: product.productId,
    name: product.name,
    price: product.price,
    thumbnailUrl: resolveAssetPath(product.images[0]?.thumbnailUrl),
    categoryId: product.category.categoryId,
    categoryName: product.category.name,
    shippingAvailable: product.option?.shippingAvailable ?? false,
  }))
}

export const getCartCatalog = cache(async function getCartCatalog(): Promise<
  CartCatalogItem[]
> {
  try {
    const products = await unstable_cache(fetchCartProducts, ['cart-catalog'], {
      revalidate: 300,
    })()
    if (
      process.env.NODE_ENV !== 'production' &&
      products.length > CART_CATALOG_SOFT_MAX
    ) {
      console.warn(
        `[getCartCatalog] ${products.length} products exceeds soft max ${CART_CATALOG_SOFT_MAX}`,
      )
    }
    return toCartItems(products)
  } catch (error) {
    console.error('[getCartCatalog]', error)
    return []
  }
})
