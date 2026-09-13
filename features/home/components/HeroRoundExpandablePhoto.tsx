'use client'

import { ExpandableProductDialog } from '@features/home/components/ExpandableProductDialog'
import { IMAGE_HOVER_ZOOM } from '@lib/imageClasses'
import { cn } from '@lib/utils'
import Image from 'next/image'

const THUMB_CLASS =
  'relative block size-full overflow-hidden rounded-full border-3 border-white'

const IMAGE_SIZES =
  '(max-width: 767px) 80px, (max-width: 1024px) 130px, 130px'

type HeroCircleThumbProps = {
  src: string
  alt: string
}

export function HeroCircleThumb({ src, alt }: HeroCircleThumbProps) {
  return (
    <div className="relative size-full overflow-hidden rounded-full border-3 border-white">
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

type HeroRoundExpandablePhotoProps = {
  src: string
  alt: string
  title: string
  productId: string
  categoryName?: string
  description: string
  tags: string[]
  price: string
  ingredients: string
}

export function HeroRoundExpandablePhoto({
  src,
  alt,
  title,
  productId,
  categoryName,
  description,
  tags,
  price,
  ingredients,
}: HeroRoundExpandablePhotoProps) {
  if (!src) {
    return (
      <div
        className={cn(THUMB_CLASS, 'bg-white/30')}
        aria-hidden
      />
    )
  }

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
      titleBadgeTone="neutral"
      thumbShape="circle"
      closeMotion="thumb-crossfade"
      triggerClassName={cn(THUMB_CLASS, 'cursor-pointer')}
      thumbPreview={<HeroCircleThumb src={src} alt={alt} />}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={IMAGE_HOVER_ZOOM}
        sizes={IMAGE_SIZES}
      />
    </ExpandableProductDialog>
  )
}
