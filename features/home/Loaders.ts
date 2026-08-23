import { HOME_GIFT_SLOTS } from '@features/home/data/giftSlots'
import { prisma } from '@lib/server/prisma'
import { unstable_cache } from 'next/cache'

const GIFT_OPTION_SELECT = {
  giftAvailable: true,
  seasonal: true,
  bulkPurchase: true,
  frozenDelivery: true,
  couponAvailable: true,
  shippingAvailable: true,
  reservationRequired: true,
} as const

export function getHomeGiftProducts() {
  const productIds = HOME_GIFT_SLOTS.map((slot) => slot.productId)

  return unstable_cache(
    () =>
      prisma.product.findMany({
        where: { productId: { in: [...productIds] } },
        select: {
          productId: true,
          name: true,
          price: true,
          description: true,
          images: { select: { thumbnailUrl: true } },
          nutritionalInfo: { select: { ingredients: true } },
          option: { select: GIFT_OPTION_SELECT },
        },
      }),
    ['home-gift-products'],
    { revalidate: 300 },
  )()
}
