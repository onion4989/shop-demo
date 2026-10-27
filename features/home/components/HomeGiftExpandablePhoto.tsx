'use client'

import { ExpandableProductDialog } from '@features/home/components/ExpandableProductDialog'
import { thumbTitleMotionProps } from '@features/home/components/expandDialogThumbMotion'
import { IMAGE_HOVER_ZOOM } from '@lib/imageClasses'
import { cn } from '@lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

const TITLE_BADGE_CLASS =
  'absolute top-4 left-4 z-10 flex items-center justify-center rounded-[24px] bg-white/25 px-2.5 py-2 text-md font-bold text-[black] backdrop-blur-md'

const IMAGE_SIZES_MOBILE = '(max-width: 767px) 50vw, 384px'
const IMAGE_SIZES_DESKTOP = '(max-width: 1024px) 50vw, 384px'

type HomeGiftExpandablePhotoProps = {
  src: string
  alt: string
  className?: string
  layout: 'mobile' | 'desktop'
  title: string
  productId: string
  description: string
  tags: string[]
  price: string
  ingredients: string
}

function GiftThumbFace({
  src,
  alt,
  layout,
  title,
  showTitle,
}: {
  src: string
  alt: string
  layout: 'mobile' | 'desktop'
  title: string
  showTitle?: boolean
}) {
  return (
    <div className="relative size-full overflow-hidden">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={layout === 'mobile' ? IMAGE_SIZES_MOBILE : IMAGE_SIZES_DESKTOP}
          className="object-cover"
        />
      ) : (
        <div className="size-full bg-[#D2B48CB4]" />
      )}
      {showTitle && layout === 'desktop' ? (
        <span className={TITLE_BADGE_CLASS}>{title}</span>
      ) : null}
    </div>
  )
}

export function HomeGiftExpandablePhoto({
  src,
  alt,
  className,
  layout,
  title,
  productId,
  description,
  tags,
  price,
  ingredients,
}: HomeGiftExpandablePhotoProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const titleMotion = thumbTitleMotionProps(isDialogOpen)
  const imageSizes =
    layout === 'mobile' ? IMAGE_SIZES_MOBILE : IMAGE_SIZES_DESKTOP

  const photo = (
    <ExpandableProductDialog
      src={src}
      alt={alt}
      title={title}
      productId={productId}
      description={description}
      tags={tags}
      price={price}
      ingredients={ingredients}
      titleBadgeTone="neutral"
      onOpenChange={setIsDialogOpen}
      closeMotion="thumb-crossfade"
      thumbPreview={
        <GiftThumbFace
          src={src}
          alt={alt}
          layout={layout}
          title={title}
          showTitle
        />
      }
      triggerClassName={cn(
        'relative h-full w-full overflow-hidden',
        layout === 'mobile' ? 'rounded-[10px]' : 'rounded-[25px]',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={imageSizes}
        className={IMAGE_HOVER_ZOOM}
      />
      {layout === 'desktop' ? (
        <motion.span className={TITLE_BADGE_CLASS} {...titleMotion}>
          {title}
        </motion.span>
      ) : null}
    </ExpandableProductDialog>
  )

  if (layout === 'mobile') {
    return (
      <div className="flex flex-col gap-1">
        {/* Fixed thumb + title row heights reduce gift-grid CLS */}
        <div className="relative w-full shrink-0 overflow-hidden rounded-[10px]">
          {photo}
        </div>
        <p className="line-clamp-2 min-h-[2.625rem] text-[14px] leading-snug wrap-break-word text-[#070707]">
          {title}
        </p>
      </div>
    )
  }

  return photo
}
