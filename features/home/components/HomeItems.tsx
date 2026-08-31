import { flavorDisplayName } from '@features/catalog/flavorDisplayName'
import { HomeItemsExpandablePhoto } from '@features/home/components/HomeItemsExpandablePhoto'
import { HOME_ITEM_GROUPS, type Item, type ItemGroup } from '@features/home/data/itemGroups'
import { getHomeItemsProducts } from '@features/home/Loaders'
import Image from 'next/image'

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

type ItemProduct = Awaited<ReturnType<typeof getHomeItemsProducts>>[number]

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

function LimitedBadge() {
  return (
    <span className="absolute top-2 right-0 z-10 shrink-0 whitespace-nowrap rounded-full bg-[#E4007E] px-[10px] py-[6px] text-xs font-bold leading-none text-white md:text-[11px] lg:text-xs">
      期間限定
    </span>
  )
}

function StaticItemThumb({
  folder,
  item,
}: {
  folder: string
  item: Item
}) {
  return (
    <div className="relative size-40 overflow-hidden rounded-full border-2 border-white md:size-[120px] lg:size-40">
      <Image
        src={`${ITEMS_DIR}/${folder}/${item.file}`}
        alt={item.label}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 160px, (min-width: 768px) 120px, 160px"
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
  const src = `${ITEMS_DIR}/${folder}/${item.file}`

  return (
    <div className="flex w-40 flex-col items-center gap-3 md:w-[120px] lg:w-40">
      <div className="relative size-40 md:size-[120px] lg:size-40">
        {product ? (
          <HomeItemsExpandablePhoto
            src={src}
            alt={item.label}
            title={flavorDisplayName(product.name)}
            productId={product.productId}
            categoryName={product.category?.name}
            description={product.description ?? ''}
            tags={itemTags(product.option)}
            price={formatPrice(product.price)}
            ingredients={itemIngredients(product.nutritionalInfo)}
          />
        ) : (
          <StaticItemThumb folder={folder} item={item} />
        )}
        {item.limited ? <LimitedBadge /> : null}
      </div>
      <p className="text-center text-sm font-bold text-[#070707] md:text-xs lg:text-sm">
        {item.label}
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
  return (
    <section className={group.wide ? 'lg:col-span-2' : undefined}>
      <h2 className="pb-[20px] text-[32px] font-bold text-[#E4007E] md:text-[24px] lg:text-[32px]">
        {group.title}
      </h2>
      <div
        className={`flex flex-wrap gap-x-6 gap-y-8 rounded-[25px] px-7 py-8 md:min-h-[180px] lg:min-h-0 ${group.tone}`}
      >
        {group.items.map((item) => (
          <ItemCard
            key={item.file}
            folder={group.folder}
            item={item}
            product={
              item.productId ? productsById.get(item.productId) : undefined
            }
          />
        ))}
      </div>
    </section>
  )
}

export async function HomeItems() {
  const products = await getHomeItemsProducts()
  const productsById = new Map(
    products.map((product) => [product.productId, product]),
  )
  const [cupcake, ice, options, tart] = HOME_ITEM_GROUPS

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-24 md:pt-24 lg:px-0 lg:pt-0 lg:pb-32">
      <div className="flex flex-col gap-12">
        <ItemCategory group={cupcake} productsById={productsById} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ItemCategory group={ice} productsById={productsById} />
          <ItemCategory group={options} productsById={productsById} />
        </div>
        <ItemCategory group={tart} productsById={productsById} />
      </div>
    </section>
  )
}
