import { getTopProducts, type TopProduct } from '@features/catalog/Loaders'
import { flavorDisplayName } from '@features/catalog/flavorDisplayName'
import { MobileRankingList } from '@features/catalog/components/MobileRankingList'
import { CrucelTrackLazy } from '@features/home/components/CrucelTrackLazy'
import { EmptyProductsMessage } from '@features/home/components/EmptyProductsMessage'
import { UnavailableProductsMessage } from '@features/home/components/UnavailableProductsMessage'
import { WordsPullSection } from '@features/home/components/WordsPullUp'
import type { CrucelItem } from '@features/home/data/crucelTest'
import { resolveAssetPath } from '@lib/utils'
import { Suspense } from 'react'

const CRUCEL_LIMIT = 10
const TITLE_CLASS =
  'mx-auto w-full max-w-[708px] px-4 pb-[20px] text-[16px] font-bold tracking-wider text-[#E4007E] md:max-w-[1200px] md:px-4 md:text-[24px] lg:px-0 lg:text-[36px]'

/** Mobile: 3 cards (131px) + gaps (15px) + more button ≈ 463px. Desktop: tilt card 344px. */
function PopularFallback() {
  return (
    <>
      <div
        className="mx-auto min-h-[463px] w-full max-w-[708px] px-4 md:hidden"
        aria-hidden
      />
      <div className="hidden min-h-[344px] w-full md:block" aria-hidden />
    </>
  )
}

export function HomeCrucelTest() {
  return (
    <WordsPullSection
      title="おすすめ人気商品 / Popular items"
      titleClass={TITLE_CLASS}
      className="w-full"
    >
      <Suspense fallback={<PopularFallback />}>
        <PopularProducts />
      </Suspense>
    </WordsPullSection>
  )
}

async function PopularProducts() {
  const result = await getTopProducts(CRUCEL_LIMIT)
  if (!result.ok) return <UnavailableProductsMessage />
  if (!result.data.length) return <EmptyProductsMessage />
  return (
    <>
      <div className="mx-auto w-full max-w-[708px] px-4 md:hidden">
        <MobileRankingList products={result.data} />
      </div>
      <div className="hidden md:block">
        <CrucelTrackLazy items={result.data.map(toCrucelItem)} />
      </div>
    </>
  )
}

function toCrucelItem(product: TopProduct): CrucelItem {
  const thumb = product.images?.[0]?.thumbnailUrl
  return {
    id: product.productId,
    src: thumb ? resolveAssetPath(thumb) : '',
    kind: product.category?.name ?? '',
    name: flavorDisplayName(product.name),
    text: product.description ?? '',
    price: yenLabel(product.price),
    tags: optionTags(product.option),
    ingredients: itemIngredients(product),
  }
}

function yenLabel(price: number) {
  return `￥${Math.round(price).toLocaleString('ja-JP')}`
}

function optionTags(option: TopProduct['option']) {
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

function itemIngredients(product: TopProduct) {
  const info = product.nutritionalInfo
  const row = Array.isArray(info) ? info[0] : info
  return row?.ingredients ?? ''
}
