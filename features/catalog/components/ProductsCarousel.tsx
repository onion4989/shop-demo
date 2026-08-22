'use client'

import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ExpandableProductDialog } from '@features/home/components/ExpandableProductDialog'
import { cn, resolveAssetPath } from '@/lib/utils'

const DUMMY_INGREDIENTS =
  '小麦粉、バター（またはマーガリン）、砂糖、卵、カスタードクリーム、アーモンドクリーム、生クリーム、チーズなど'

type ProductOption = {
  giftAvailable: boolean
  seasonal: boolean
  bulkPurchase: boolean
  frozenDelivery: boolean
  couponAvailable: boolean
}

type RankingProduct = {
  id: number
  productId: string
  name: string
  price: number
  description: string | null
  images?: { thumbnailUrl: string | null }[]
  option?: ProductOption | null
}

type ProductsCarouselProps = {
  products: RankingProduct[]
}

function optionTags(option?: ProductOption | null) {
  if (!option) return []
  const tags: string[] = []
  if (option.giftAvailable) tags.push('ギフト対応')
  if (option.seasonal) tags.push('季節限定')
  if (option.bulkPurchase) tags.push('まとめ買い対象')
  if (option.frozenDelivery) tags.push('冷凍配送')
  if (option.couponAvailable) tags.push('クーポン可')
  return tags
}

function formatPrice(price: number) {
  return `￥${Math.round(price).toLocaleString('ja-JP')}`
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <div
      className="pointer-events-none absolute -top-10 -left-10 z-10 flex size-20 items-center justify-center rounded-full bg-[#3CB371]"
      aria-hidden
    >
      <span className="translate-x-3.5 translate-y-3.5 text-2xl font-bold text-white">
        {rank}
      </span>
    </div>
  )
}

function RankingCardFace({
  rank,
  name,
  description,
  src,
  tags,
  className,
}: {
  rank: number
  name: string
  description: string
  src: string
  tags: string[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex h-[340px] w-full flex-col overflow-hidden rounded-[10px] bg-[#D2B48CB4] p-2.5 shadow-sm lg:h-[380px] lg:p-3',
        className,
      )}
    >
      <RankBadge rank={rank} />

      <div className="relative h-[120px] w-full shrink-0 overflow-hidden rounded-[10px] lg:h-[150px]">
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1023px) 220px, 282px"
          />
        ) : (
          <div className="size-full bg-white/30" />
        )}
      </div>

      <div className="mt-[15px] flex min-h-0 flex-1 flex-col">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[5px] bg-[#6B4226] px-1.5 py-0.5 text-[10px] font-bold text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <p
          className={cn(
            'line-clamp-1 text-left text-sm font-bold text-[#070707]',
            tags.length > 0 && 'mt-1.5',
          )}
        >
          {name}
        </p>
        <div className="mt-[15px] min-h-[100px] flex-1 overflow-hidden rounded-[10px] bg-white/80 px-2.5 py-2">
          <p className="line-clamp-5 text-left text-[11px] leading-snug text-[#070707] lg:line-clamp-6">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

function RankingCard({
  product,
  rank,
  onDialogOpenChange,
}: {
  product: RankingProduct
  rank: number
  onDialogOpenChange?: (open: boolean) => void
}) {
  const thumb = product.images?.[0]?.thumbnailUrl ?? null
  const src = thumb ? resolveAssetPath(thumb) : ''
  const description = product.description ?? ''
  const tags = optionTags(product.option)

  return (
    <ExpandableProductDialog
      src={src}
      alt={product.name}
      title={product.name}
      description={description}
      tags={tags}
      price={formatPrice(product.price)}
      ingredients={DUMMY_INGREDIENTS}
      triggerClassName="block w-[220px] lg:w-full"
      onOpenChange={onDialogOpenChange}
      closeMotion="thumb-crossfade"
      thumbPreview={
        <RankingCardFace
          rank={rank}
          name={product.name}
          description={description}
          src={src}
          tags={tags}
          className="h-full lg:h-full"
        />
      }
    >
      <RankingCardFace
        rank={rank}
        name={product.name}
        description={description}
        src={src}
        tags={tags}
      />
    </ExpandableProductDialog>
  )
}

const arrowClassName =
  'absolute top-1/2 z-20 h-[50px] w-[50px] -translate-y-1/2 cursor-pointer rounded-full border-2 border-white bg-[#6B4226] text-white shadow-md hover:bg-[#6B4226] hover:text-white [&>svg]:size-6!'

export function ProductsCarousel({ products }: ProductsCarouselProps) {
  const canLoop = products.length > 4
  const showArrowsMd = products.length > 3
  const showArrowsLg = products.length > 4
  const [api, setApi] = useState<CarouselApi>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const autoplay = useRef(
    Autoplay({
      delay: 4500,
      playOnInit: false,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    })
  )

  useEffect(() => {
    if (!api) return

    const plugin = autoplay.current
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      if (!dialogOpen && !mq.matches && canLoop) {
        plugin.play()
      } else {
        plugin.stop()
      }
    }

    sync()
    mq.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      plugin.stop()
    }
  }, [api, canLoop, dialogOpen])

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'start',
        loop: canLoop,
        slidesToScroll: 1,
      }}
      plugins={[autoplay.current]}
      className="relative w-full"
    >
      <div className="relative w-full">
        <CarouselContent className="-ml-6">
          {products.map((product, index) => (
            <CarouselItem
              key={product.productId}
              className="basis-[244px] pl-6 lg:basis-1/4"
            >
              <RankingCard
                product={product}
                rank={index + 1}
                onDialogOpenChange={setDialogOpen}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className={cn(
            arrowClassName,
            '-left-5 right-auto hidden',
            showArrowsMd && 'md:flex',
            !showArrowsLg && 'lg:hidden'
          )}
        />
        <CarouselNext
          className={cn(
            arrowClassName,
            '-right-5 left-auto hidden',
            showArrowsMd && 'md:flex',
            !showArrowsLg && 'lg:hidden'
          )}
        />
      </div>
    </Carousel>
  )
}
