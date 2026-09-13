import { flavorDisplayName } from '@features/catalog/flavorDisplayName'
import { HeroFanCards } from '@features/home/components/HeroFanCards'
import {
  HeroRoundItems,
  type HeroRoundItem,
} from '@features/home/components/HeroRoundItems'
import {
  heroRoundBadges,
  heroRoundFallbacks,
} from '@features/home/data/hero'
import { getHomeHeroProducts } from '@features/home/Loaders'
import { resolveAssetPath } from '@lib/utils'

type HeroOption = {
  giftAvailable: boolean
  seasonal: boolean
  bulkPurchase: boolean
  frozenDelivery: boolean
  couponAvailable: boolean
  shippingAvailable: boolean
  reservationRequired: boolean
} | null

function heroTags(option: HeroOption) {
  if (!option) return []
  const tags: string[] = []
  if (option.giftAvailable) tags.push('ギフト対応')
  if (option.seasonal) tags.push('季節限定')
  if (option.bulkPurchase) tags.push('まとめ買い対象')
  if (option.frozenDelivery) tags.push('冷凍配送')
  if (option.couponAvailable) tags.push('クーポン可')
  if (option.shippingAvailable) tags.push('配送可')
  if (option.reservationRequired) tags.push('予約制')
  return tags
}

function heroIngredients(
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

function buildHeroRoundItems(
  products: Awaited<ReturnType<typeof getHomeHeroProducts>>,
): HeroRoundItem[] {
  return products.map((product, index) => {
    const thumb = product.images[0]?.thumbnailUrl
    const src = thumb ? resolveAssetPath(thumb) : ''
    const title = flavorDisplayName(product.name)
    const badge = heroRoundBadges[index] ?? heroRoundBadges[0]

    return {
      id: product.productId,
      productId: product.productId,
      src,
      alt: title,
      title,
      categoryName: product.category?.name,
      description: product.description ?? '',
      tags: heroTags(product.option),
      price: formatPrice(product.price),
      ingredients: heroIngredients(product.nutritionalInfo),
      badge,
      interactive: true,
    }
  })
}

function buildHeroRoundFallbacks(): HeroRoundItem[] {
  return heroRoundFallbacks.map((item, index) => ({
    id: item.id,
    src: resolveAssetPath(item.filename),
    alt: item.alt,
    badge: heroRoundBadges[index] ?? heroRoundBadges[0],
    interactive: false,
  }))
}

export async function Hero() {
  const products = await getHomeHeroProducts()
  const roundItems =
    products.length > 0
      ? buildHeroRoundItems(products)
      : buildHeroRoundFallbacks()

  return (
    <section className="relative -mt-[100px] flex h-[400px] max-h-[400px] w-full flex-col overflow-hidden md:h-[clamp(600px,calc(26.0417vw+400px),900px)] md:max-h-none">
      <div className="relative z-0 flex min-h-0 flex-1 flex-col bg-[#F4B2BA] md:justify-start">
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 md:pt-[120px] lg:pt-[128px] xl:pt-[136px]">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="relative mx-auto w-full max-w-[996px] translate-y-12 md:-translate-y-3 lg:-translate-y-2">
              <div className="relative z-10 flex justify-center max-md:translate-y-4 md:translate-y-0">
                <HeroFanCards />
              </div>

              <div className="relative z-20 -mt-[48px] flex h-[100px] items-end justify-center md:-mt-14 md:h-[120px] md:translate-y-0 lg:-mt-[72px] xl:-mt-[76px] xl:h-[130px]">
                <div
                  className="absolute bottom-0 left-0 z-20 h-[60px] w-full rounded-full bg-[#FFFDED] md:left-1/2 md:h-20 md:max-w-[clamp(600px,calc(34.375vw+336px),996px)] md:-translate-x-1/2 lg:h-24"
                  aria-hidden
                />

                <div className="relative z-30 max-md:-translate-y-4 md:translate-y-0">
                  <HeroRoundItems items={roundItems} />
                </div>
              </div>
            </div>
          </div>

          <h1 className="relative z-10 shrink-0 pb-1 text-center text-2xl font-black tracking-wider text-black max-md:mt-4 md:max-lg:-mt-4 md:text-[clamp(48px,calc(3.2986vw+22.667px),86px)] md:leading-none lg:mt-6 xl:mt-8">
            CAKE SHOP DEMO
          </h1>
        </div>
      </div>

      <img
        src="/assets/pages/top/hero/decorations/deco_top_under-wave.svg"
        alt=""
        className="relative z-0 block w-full shrink-0"
      />
    </section>
  )
}
