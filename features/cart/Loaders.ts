import type { CartCatalogItem } from '@features/cart/types'
import { prisma } from '@lib/server/prisma'
import { resolveAssetPath } from '@lib/utils'
import { unstable_cache } from 'next/cache'

export async function getCartCatalog(): Promise<CartCatalogItem[]> {
  const products = await unstable_cache(
    () =>
      prisma.product.findMany({
        select: {
          productId: true,
          name: true,
          price: true,
          category: { select: { categoryId: true, name: true } },
          images: { select: { thumbnailUrl: true } },
          option: { select: { shippingAvailable: true } },
        },
      }),
    ['cart-catalog'],
    { revalidate: 300 },
  )()

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
