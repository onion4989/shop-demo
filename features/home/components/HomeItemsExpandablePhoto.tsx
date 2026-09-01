'use client'

import { ExpandableProductDialog } from '@features/home/components/ExpandableProductDialog'
import { IMAGE_HOVER_ZOOM } from '@lib/imageClasses'
import { cn } from '@lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

const THUMB_CLASS =
  'relative block size-[100px] md:size-[120px] lg:size-40'

const CIRCLE_CLASS =
  'relative size-full overflow-hidden rounded-full border-2 border-white'

const IMAGE_SIZES =
  '(max-width: 767px) 100px, (min-width: 1024px) 160px, 120px'

const LIMITED_BADGE_CLASS =
  'absolute top-2 right-0 z-10 shrink-0 whitespace-nowrap rounded-full bg-[#E4007E] px-[10px] py-[6px] text-xs font-bold leading-none text-white md:text-[11px] lg:text-xs'

const BADGE_SLIDE_X = -12
const BADGE_DURATION = 0.4
const BADGE_DELAY = 0.2

type ItemCircleThumbProps = {
  src: string
  alt: string
}

function ItemCircleThumb({ src, alt }: ItemCircleThumbProps) {
  return (
    <div className={CIRCLE_CLASS}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={IMAGE_SIZES}
      />
    </div>
  )
}

type LimitedItemBadgeProps = {
  animKey?: number
}

export function LimitedItemBadge({ animKey = 0 }: LimitedItemBadgeProps) {
  return (
    <motion.span
      key={animKey}
      className={LIMITED_BADGE_CLASS}
      initial={{ opacity: 0, x: BADGE_SLIDE_X }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: BADGE_DURATION,
        delay: BADGE_DELAY,
        ease: 'easeOut',
      }}
    >
      期間限定
    </motion.span>
  )
}

type HomeItemsExpandablePhotoProps = {
  src: string
  alt: string
  title: string
  productId: string
  categoryName?: string
  description: string
  tags: string[]
  price: string
  ingredients: string
  limited?: boolean
}

export function HomeItemsExpandablePhoto({
  src,
  alt,
  title,
  productId,
  categoryName,
  description,
  tags,
  price,
  ingredients,
  limited = false,
}: HomeItemsExpandablePhotoProps) {
  const [badgeKey, setBadgeKey] = useState(0)

  return (
    <ExpandableProductDialog
      src={src}
      alt={alt}
      title={title}
      productId={productId}
      categoryName={categoryName}
      description={description}
      tags={tags}
      price={price}
      ingredients={ingredients}
      thumbShape="circle"
      closeMotion="thumb-crossfade"
      triggerClassName={cn(THUMB_CLASS, 'cursor-pointer')}
      thumbPreview={<ItemCircleThumb src={src} alt={alt} />}
      onOpenChange={(open) => {
        if (!open) setBadgeKey((key) => key + 1)
      }}
    >
      <div className={CIRCLE_CLASS}>
        <Image
          src={src}
          alt={alt}
          fill
          className={IMAGE_HOVER_ZOOM}
          sizes={IMAGE_SIZES}
        />
      </div>
      {limited ? <LimitedItemBadge animKey={badgeKey} /> : null}
    </ExpandableProductDialog>
  )
}
