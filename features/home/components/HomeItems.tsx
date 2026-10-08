import { flavorDisplayName } from '@features/catalog/flavorDisplayName'
import { EmptyProductsMessage } from '@features/home/components/EmptyProductsMessage'
import { UnavailableProductsMessage } from '@features/home/components/UnavailableProductsMessage'
import type { HomeProductRow } from '@features/home/Loaders'
import {
  HomeItemsExpandablePhoto,
  LimitedItemBadge,
} from '@features/home/components/HomeItemsExpandablePhoto'
import { WordsPullSection } from '@features/home/components/WordsPullUp'
import { HOME_ITEM_GROUPS, type Item, type ItemGroup } from '@features/home/data/itemGroups'
import { getHomeItemsProducts } from '@features/home/Loaders'
import { resolveAssetPath } from '@lib/utils'
import Image from 'next/image'

const ITEM_TITLE_CLASS =
  'pb-[20px] text-[16px] font-bold text-[#E4007E] md:text-[24px] lg:text-[32px]'

const ITEMS_DIR = '/assets/pages/top/items'

type ItemOption = {
  giftAvailable: boolean
  seasonal: boolean
  bulkPurchase: boolean
  frozenDelivery: boolean
  couponAvailable: boolean
  shippingAvailable: boolean
  reservationRequired: boolean
} | null

type ItemProduct = HomeProductRow

function itemTags(option: ItemOption) {
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

function itemIngredients(
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

function StaticItemThumb({
  folder,
  item,
}: {
  folder: string
  item: Item
}) {
  return (
    <div className="relative size-[100px] overflow-hidden rounded-full border-2 border-white md:size-[120px] lg:size-40">
      <Image
        src={`${ITEMS_DIR}/${folder}/${item.file}`}
        alt={item.label}
        fill
        className="object-cover"
        sizes="(max-width: 767px) 100px, (min-width: 1024px) 160px, 120px"
      />
    </div>
  )
}

function ItemCard({
  folder,
  item,
  product,
}: {
  folder: string
  item: Item
  product?: ItemProduct
}) {
  if (!item.productId) {
    return (
      <div className="flex w-full flex-col items-center gap-1 md:w-[120px] lg:w-40 lg:gap-3">
        <div className="relative size-[100px] md:size-[120px] lg:size-40">
          <StaticItemThumb folder={folder} item={item} />
          {item.limited ? <LimitedItemBadge /> : null}
        </div>
        <p className="w-full text-center text-[14px] leading-snug font-normal break-words text-[#070707] md:text-xs lg:text-sm">
          {item.label}
        </p>
      </div>
    )
  }

  if (!product) return null

  const thumb = product.images[0]?.thumbnailUrl
  const src = thumb ? resolveAssetPath(thumb) : ''
  const label = flavorDisplayName(product.name) || item.label

  return (
    <div className="flex w-full flex-col items-center gap-1 md:w-[120px] lg:w-40 lg:gap-3">
      <div className="relative size-[100px] md:size-[120px] lg:size-40">
        <HomeItemsExpandablePhoto
          src={src}
          alt={label}
          title={label}
          productId={product.productId}
          categoryName={product.category?.name}
          description={product.description ?? ''}
          tags={itemTags(product.option)}
          price={formatPrice(product.price)}
          ingredients={itemIngredients(product.nutritionalInfo)}
          limited={item.limited}
        />
      </div>
      <p className="w-full text-center text-[14px] leading-snug font-normal break-words text-[#070707] md:text-xs lg:text-sm">
        {label}
      </p>
    </div>
  )
}

function ItemCategory({
  group,
  productsById,
}: {
  group: ItemGroup
  productsById: Map<string, ItemProduct>
}) {
  const cards = group.items
    .map((item) => (
      <ItemCard
        key={item.file}
        folder={group.folder}
        item={item}
        product={
          item.productId ? productsById.get(item.productId) : undefined
        }
      />
    ))
    .filter(Boolean)

  if (cards.length === 0) return null

  const wideClass = group.wide ? 'lg:col-span-2' : undefined
  const cardGrid = (
    <div
      className={`grid grid-cols-3 gap-x-4 gap-y-[18px] rounded-[15px] px-4 py-6 md:flex md:flex-wrap md:gap-x-6 md:gap-y-8 md:rounded-[25px] md:px-7 md:py-8 md:min-h-[180px] lg:min-h-0 ${group.tone}`}
    >
      {cards}
    </div>
  )

  return (
    <WordsPullSection
      title={group.title}
      titleClass={ITEM_TITLE_CLASS}
      className={wideClass}
    >
      {cardGrid}
    </WordsPullSection>
  )
}

export async function HomeItems() {
  const result = await getHomeItemsProducts()

  if (!result.ok) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-4 pb-0 md:pb-24 lg:px-0 lg:pb-32">
        <UnavailableProductsMessage />
      </section>
    )
  }

  const products = result.data

  if (!products.length) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-4 pb-0 md:pb-24 lg:px-0 lg:pb-32">
        <EmptyProductsMessage />
      </section>
    )
  }

  const productsById = new Map(
    products.map((product) => [product.productId, product]),
  )
  const [cupcake, ice, options, tart] = HOME_ITEM_GROUPS

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-0 md:pb-24 lg:px-0 lg:pb-32">
      <div className="flex flex-col gap-10 md:gap-12">
        <ItemCategory group={cupcake} productsById={productsById} />
        <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-2 lg:gap-6">
          <ItemCategory group={ice} productsById={productsById} />
          <ItemCategory group={options} productsById={productsById} />
        </div>
        <ItemCategory group={tart} productsById={productsById} />
      </div>
    </section>
  )
}
