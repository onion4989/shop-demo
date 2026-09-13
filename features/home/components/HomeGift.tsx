import { EmptyProductsMessage } from '@features/home/components/EmptyProductsMessage'
import { HomeGiftExpandablePhoto } from '@features/home/components/HomeGiftExpandablePhoto'
import {
  HOME_GIFT_DESKTOP_SLOTS,
  HOME_GIFT_MOBILE_SLOTS,
} from '@features/home/data/giftSlots'
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

type GiftSlot = {
  productId: string
  className: string
}

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

  function renderSlot(slot: GiftSlot, layout: 'mobile' | 'desktop') {
    const product = byId.get(slot.productId)
    if (!product) return null
    const thumb = product.images[0]?.thumbnailUrl
    const src = thumb ? resolveAssetPath(thumb) : ''

    return (
      <HomeGiftExpandablePhoto
        key={`${layout}-${slot.productId}`}
        layout={layout}
        src={src}
        alt={product.name}
        className={slot.className}
        title={product.name}
        productId={product.productId}
        description={product.description ?? ''}
        tags={giftTags(product.option)}
        price={formatPrice(product.price)}
        ingredients={giftIngredients(product.nutritionalInfo)}
      />
    )
  }

  return (
    <section className="relative mb-[var(--space-drop-deco)] bg-gradient-to-b from-[#FBDCC0] to-[#F4B2BA]">
      <div className="relative mx-auto w-full max-w-[1440px] md:min-h-[900px]">
        {bubbles.map((bubble) => (
          <span
            key={bubble.className}
            aria-hidden
            className={`pointer-events-none absolute hidden rounded-full bg-white/40 md:block ${bubble.className}`}
            style={{ width: bubble.size, height: bubble.size }}
          />
        ))}

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 lg:px-0">
          <h2 className="pt-[30px] pb-[20px] text-[16px] font-bold text-[#E4007E] md:text-[24px] lg:text-[32px]">
            ギフト / Gift
          </h2>
          {products.length === 0 ? (
            <EmptyProductsMessage />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 pb-8 md:hidden">
                {HOME_GIFT_MOBILE_SLOTS.map((slot) =>
                  renderSlot(slot, 'mobile'),
                )}
              </div>
              <div className="hidden gap-6 pb-8 md:grid md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[280px_280px_128px]">
                {HOME_GIFT_DESKTOP_SLOTS.map((slot) =>
                  renderSlot(slot, 'desktop'),
                )}
              </div>
            </>
          )}
        </div>

        <img
          src="/assets/pages/top/gift/decorations/deco_top_under-drops.svg"
          alt=""
          width={385}
          height={94}
          className="pointer-events-none absolute top-full left-1/2 z-10 w-[385px] max-w-[90%] -translate-x-1/2 -translate-y-px"
        />
      </div>
    </section>
  )
}
