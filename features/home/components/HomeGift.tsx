import { HomeGiftExpandablePhoto } from '@features/home/components/HomeGiftExpandablePhoto'
import { HOME_GIFT_SLOTS } from '@features/home/data/giftSlots'
import { getHomeGiftProducts } from '@features/home/Loaders'
import { resolveAssetPath } from '@lib/utils'

const bubbles = [
  { size: 40, className: 'top-[8%] left-[6%]' },
  { size: 64, className: 'top-[37px] right-[14px]' },
  { size: 108, className: 'top-[172px] right-[46px]' },
  { size: 28, className: 'top-[18%] left-[22%]' },
  { size: 80, className: 'top-[312px] left-[85px]' },
  { size: 52, className: 'top-[42%] right-[9%]' },
  { size: 140, className: 'top-[521px] left-[41px]' },
  { size: 96, className: 'top-[68%] right-[5%]' },
  { size: 36, className: 'top-[82%] left-[12%]' },
  { size: 72, className: 'top-[88%] right-[18%]' },
]

type GiftOption = {
  giftAvailable: boolean
  couponAvailable: boolean
  shippingAvailable: boolean
  reservationRequired: boolean
} | null

function giftTags(option: GiftOption) {
  if (!option) return []
  const tags: string[] = []
  if (option.couponAvailable) tags.push('クーポン可')
  if (option.shippingAvailable) tags.push('配送可')
  if (option.giftAvailable) tags.push('贈答可')
  if (option.reservationRequired) tags.push('予約制')
  return tags
}

function giftIngredients(
  info:
    | { ingredients: string | null }
    | { ingredients: string | null }[]
    | null
    | undefined,
) {
  const row = Array.isArray(info) ? info[0] : info
  return row?.ingredients ?? ''
}

function formatPrice(price: number) {
  return `￥${Math.round(price).toLocaleString('ja-JP')}`
}

export async function HomeGift() {
  const products = await getHomeGiftProducts()
  const byId = new Map(products.map((product) => [product.productId, product]))

  return (
    <section className="relative mb-[93px] bg-gradient-to-b from-[#FBDCC0] to-[#F4B2BA]">
      <div className="relative mx-auto min-h-[800px] w-full max-w-[1440px]">
        {bubbles.map((bubble) => (
          <span
            key={bubble.className}
            aria-hidden
            className={`pointer-events-none absolute rounded-full bg-white/40 ${bubble.className}`}
            style={{ width: bubble.size, height: bubble.size }}
          />
        ))}

        <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-4 pt-8 pb-8 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[280px_280px_128px] lg:px-0">
          {HOME_GIFT_SLOTS.map((slot) => {
            const product = byId.get(slot.productId)
            if (!product) return null
            const thumb = product.images[0]?.thumbnailUrl
            const src = thumb ? resolveAssetPath(thumb) : ''

            return (
              <HomeGiftExpandablePhoto
                key={slot.productId}
                src={src}
                alt={product.name}
                className={slot.className}
                title={product.name}
                description={product.description ?? ''}
                tags={giftTags(product.option)}
                price={formatPrice(product.price)}
                ingredients={giftIngredients(product.nutritionalInfo)}
              />
            )
          })}
        </div>

        <img
          src="/assets/pages/top/gift/decorations/bg_under_drops.svg"
          alt=""
          width={385}
          height={94}
          className="pointer-events-none absolute top-full left-1/2 z-10 w-[385px] max-w-[90%] -translate-x-1/2 -translate-y-px"
        />
      </div>
    </section>
  )
}
