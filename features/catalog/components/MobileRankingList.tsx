'use client'

import { flavorDisplayName } from '@features/catalog/flavorDisplayName'
import { ExpandableProductDialog } from '@features/home/components/ExpandableProductDialog'
import { resolveAssetPath } from '@lib/utils'
import { cn } from '@lib/utils'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'

const LOAD_STEP = 3
const LOAD_DELAY_MS = 800

type ProductOption = {
  giftAvailable: boolean
  seasonal: boolean
  bulkPurchase: boolean
  frozenDelivery: boolean
  couponAvailable: boolean
  shippingAvailable: boolean
  reservationRequired: boolean
}

export type MobileRankingProduct = {
  productId: string
  name: string
  price: number
  description: string | null
  images?: { thumbnailUrl: string | null }[]
  category?: { name: string } | null
  nutritionalInfo?:
    | { ingredients: string | null }
    | { ingredients: string | null }[]
    | null
  option?: ProductOption | null
}

function optionTags(option?: ProductOption | null) {
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

function formatPrice(price: number) {
  return `￥${Math.round(price).toLocaleString('ja-JP')}`
}

function productIngredients(product: MobileRankingProduct) {
  const info = product.nutritionalInfo
  const row = Array.isArray(info) ? info[0] : info
  return row?.ingredients ?? ''
}

function MobileRankBadge({ rank }: { rank: number }) {
  return (
    <div
      className="pointer-events-none absolute -top-7 -left-7 z-10 flex size-14 items-center justify-center rounded-full bg-[#3CB371]"
      aria-hidden
    >
      <span className="translate-x-3 translate-y-3 text-base font-bold text-white">
        {rank}
      </span>
    </div>
  )
}

function MobileRankingCardFace({
  rank,
  name,
  categoryName,
  description,
  src,
  tags,
  className,
}: {
  rank: number
  name: string
  categoryName?: string
  description: string
  src: string
  tags: string[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex h-[131px] w-full items-stretch gap-2 overflow-hidden rounded-[10px] bg-[#D2B48CB4] p-2.5',
        className,
      )}
    >
      <MobileRankBadge rank={rank} />

      <div className="relative size-[110px] shrink-0 overflow-hidden rounded-[5px]">
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            sizes="110px"
          />
        ) : (
          <div className="size-full bg-white/30" />
        )}
        {categoryName ? (
          <div className="absolute inset-x-0 bottom-0 bg-black/70 py-0.5 text-center">
            <span className="text-[10px] text-white">{categoryName}</span>
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[3px] bg-[#6B4226] px-1 py-0.5 text-[10px] font-bold text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <p
          className={cn(
            'line-clamp-1 text-left text-[14px] font-bold text-[#070707]',
            tags.length > 0 && 'mt-1',
          )}
        >
          {name}
        </p>
        <div className="mt-1.5 min-h-0 flex-1 overflow-hidden rounded-[5px] bg-white/80 px-2 py-1.5">
          <p className="line-clamp-3 text-left text-[10px] leading-snug text-[#070707]">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

function MobileRankingCard({
  product,
  rank,
}: {
  product: MobileRankingProduct
  rank: number
}) {
  const thumb = product.images?.[0]?.thumbnailUrl ?? null
  const src = thumb ? resolveAssetPath(thumb) : ''
  const description = product.description ?? ''
  const tags = optionTags(product.option).slice(0, 2)
  const name = flavorDisplayName(product.name)
  const categoryName = product.category?.name

  return (
    <ExpandableProductDialog
      src={src}
      alt={name}
      title={name}
      productId={product.productId}
      categoryName={categoryName}
      description={description}
      tags={tags}
      price={formatPrice(product.price)}
      ingredients={productIngredients(product)}
      titleBadgeTone="neutral"
      triggerClassName="block w-full"
      closeMotion="thumb-crossfade"
      thumbPreview={
        <MobileRankingCardFace
          rank={rank}
          name={name}
          categoryName={categoryName}
          description={description}
          src={src}
          tags={tags}
          className="h-full"
        />
      }
    >
      <MobileRankingCardFace
        rank={rank}
        name={name}
        categoryName={categoryName}
        description={description}
        src={src}
        tags={tags}
      />
    </ExpandableProductDialog>
  )
}

type MobileRankingListProps = {
  products: MobileRankingProduct[]
}

export function MobileRankingList({ products }: MobileRankingListProps) {
  const [visible, setVisible] = useState(Math.min(LOAD_STEP, products.length))
  const [loading, setLoading] = useState(false)

  const hasMore = visible < products.length

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)
    window.setTimeout(() => {
      setVisible((count) => Math.min(count + LOAD_STEP, products.length))
      setLoading(false)
    }, LOAD_DELAY_MS)
  }, [hasMore, loading, products.length])

  return (
    <div className="flex flex-col gap-[15px] md:hidden">
      {products.slice(0, visible).map((product, index) => (
        <MobileRankingCard
          key={product.productId}
          product={product}
          rank={index + 1}
        />
      ))}

      {hasMore ? (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2 text-[16px] text-black disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden />
              <span className="sr-only">読み込み中</span>
            </>
          ) : (
            'もっと見る'
          )}
        </button>
      ) : null}
    </div>
  )
}
