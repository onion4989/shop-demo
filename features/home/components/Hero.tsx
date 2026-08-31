import { flavorDisplayName } from '@features/catalog/flavorDisplayName'
import { HeroFanCards } from '@features/home/components/HeroFanCards'
import {
  HeroRoundItems,
  type HeroRoundItem,
} from '@features/home/components/HeroRoundItems'
import { heroRoundBadges } from '@features/home/data/hero'
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
    }
  })
}

export async function Hero() {
  const products = await getHomeHeroProducts()
  const roundItems = buildHeroRoundItems(products)

  return (
    // モバイルは後で差し替え。md+ は 768px=600px → 1920px=900px
    <section className="relative -mt-[100px] flex h-[1000px] w-full flex-col overflow-hidden md:h-[clamp(600px,calc(26.0417vw+400px),900px)]">
      {/* 5. 背景：ピンク矩形 */}
      <div className="relative z-0 flex min-h-0 flex-1 flex-col bg-[#F4B2BA]">
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center px-4 pt-[100px] md:justify-center md:pt-[120px] lg:pt-[128px] xl:pt-[136px]">
          {/* カード + pill + アイテムの重ねブロック */}
          <div className="relative w-full max-w-[996px]">
            {/* 4. 扇カード（pill の後ろ） */}
            <div className="relative z-10 flex justify-center">
              <HeroFanCards />
            </div>

            {/* 3. pill / 2. アイテム / 1. タグ */}
            <div className="relative z-20 -mt-[100px] flex h-[130px] items-end justify-center md:-mt-20 md:h-[120px] lg:-mt-24 xl:-mt-[100px] xl:h-[130px]">
              {/* 3. 角丸レクタングル（アイテム中央より下に配置） */}
              <div
                className="absolute bottom-0 left-1/2 z-20 h-24 w-full max-w-[996px] -translate-x-1/2 rounded-full bg-[#FFFDED] md:h-20 md:max-w-[clamp(600px,calc(34.375vw+336px),996px)] lg:h-24"
                aria-hidden
              />

              {/* 2. 丸アイテム（pill 中央より上にはみ出す）+ 1. タグ */}
              <HeroRoundItems items={roundItems} />
            </div>
          </div>

          <h1 className="relative z-10 mt-8 text-center text-4xl font-black tracking-wider text-black sm:text-6xl md:mt-5 md:text-[clamp(48px,calc(3.2986vw+22.667px),86px)] md:leading-none lg:mt-6 xl:mt-8">
            CAKE SHOP DEMO
          </h1>
        </div>
      </div>

      {/* 5. 背景：下部ウェーブ（section 高さに含む） */}
      <img
        src="/assets/pages/top/hero/decorations/deco_top_under-wave.svg"
        alt=""
        className="relative z-0 block w-full shrink-0"
      />
    </section>
  )
}
