import { HOME_ITEMS_PRODUCT_IDS } from '@features/home/data/itemGroups'
import { HOME_GIFT_SLOTS } from '@features/home/data/giftSlots'
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

export function getHomeGiftProducts() {
  const productIds = HOME_GIFT_SLOTS.map((slot) => slot.productId)

  return unstable_cache(
    async () => {
      try {
        return await prisma.product.findMany({
          where: { productId: { in: [...productIds] } },
          select: HOME_PRODUCT_SELECT,
        })
      } catch (error) {
        console.error('[getHomeGiftProducts]', error)
        return []
      }
    },
    ['home-gift-products'],
    { revalidate: 300 },
  )()
}

export function getHomeItemsProducts() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.product.findMany({
          where: { productId: { in: [...HOME_ITEMS_PRODUCT_IDS] } },
          select: HOME_PRODUCT_SELECT,
        })
      } catch (error) {
        console.error('[getHomeItemsProducts]', error)
        return []
      }
    },
    ['home-items-products'],
    { revalidate: 300 },
  )()
}

const HERO_ROUND_LIMIT = 5

export function getHomeHeroProducts() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.product.findMany({
          take: HERO_ROUND_LIMIT,
          where: { recommend: { gt: 0 } },
          orderBy: { recommend: 'asc' },
          select: HOME_PRODUCT_SELECT,
        })
      } catch (error) {
        console.error('[getHomeHeroProducts]', error)
        return []
      }
    },
    ['home-hero-products'],
    { revalidate: 300 },
  )()
}
