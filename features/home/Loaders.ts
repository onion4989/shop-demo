import { getTopProducts } from '@features/catalog/Loaders'
import { HOME_ITEMS_PRODUCT_IDS } from '@features/home/data/itemGroups'
import { HOME_GIFT_SLOTS } from '@features/home/data/giftSlots'
import type { LoadResult } from '@lib/server/loadResult'
import { prisma } from '@lib/server/prisma'
import { unstable_cache } from 'next/cache'

const PRODUCT_OPTION_SELECT = {
  giftAvailable: true,
  seasonal: true,
  bulkPurchase: true,
  frozenDelivery: true,
  couponAvailable: true,
  shippingAvailable: true,
  reservationRequired: true,
} as const

const HOME_PRODUCT_SELECT = {
  productId: true,
  name: true,
  price: true,
  description: true,
  category: { select: { name: true } },
  images: { select: { thumbnailUrl: true } },
  nutritionalInfo: { select: { ingredients: true } },
  option: { select: PRODUCT_OPTION_SELECT },
} as const

function fetchHomeGift() {
  const productIds = HOME_GIFT_SLOTS.map((slot) => slot.productId)
  return prisma.product.findMany({
    where: { productId: { in: [...productIds] } },
    select: HOME_PRODUCT_SELECT,
  })
}

function fetchHomeItems() {
  return prisma.product.findMany({
    where: { productId: { in: [...HOME_ITEMS_PRODUCT_IDS] } },
    select: HOME_PRODUCT_SELECT,
  })
}

const HERO_ROUND_LIMIT = 5
const TOP_PRODUCT_LIMIT = 10

export type HomeProductRow = Awaited<ReturnType<typeof fetchHomeGift>>[number]

async function wrapCached<T>(
  key: string[],
  query: () => Promise<T>,
  label: string,
): Promise<LoadResult<T>> {
  try {
    const data = await unstable_cache(query, key, { revalidate: 300 })()
    return { ok: true, data }
  } catch (error) {
    console.error(`[${label}]`, error)
    return { ok: false, reason: 'unavailable' }
  }
}

export function getHomeGiftProducts() {
  return wrapCached(['home-gift-products'], fetchHomeGift, 'getHomeGiftProducts')
}

export function getHomeItemsProducts() {
  return wrapCached(
    ['home-items-products'],
    fetchHomeItems,
    'getHomeItemsProducts',
  )
}

/** Hero 用。正本は getTopProducts(10)。先頭 5 件のみ返す */
export async function getHomeHeroProducts() {
  const result = await getTopProducts(TOP_PRODUCT_LIMIT)
  if (!result.ok) return result
  return {
    ok: true as const,
    data: result.data.slice(0, HERO_ROUND_LIMIT),
  }
}
