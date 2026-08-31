'use client'

import { ExpandableProductDialog } from '@features/home/components/ExpandableProductDialog'
import { IMAGE_HOVER_ZOOM } from '@lib/imageClasses'
import { cn } from '@lib/utils'
import Image from 'next/image'

const TITLE_BADGE_CLASS =
  'absolute top-4 left-4 z-10 flex items-center justify-center rounded-[25px] bg-white/25 px-2.5 py-2 text-sm font-bold text-[#E4007E] backdrop-blur-md'

type HomeGiftExpandablePhotoProps = {
  src: string
  alt: string
  className?: string
  title: string
  productId: string
  description: string
  tags: string[]
  price: string
  ingredients: string
}

export function HomeGiftExpandablePhoto({
  src,
  alt,
  className,
  title,
  productId,
  description,
  tags,
  price,
  ingredients,
}: HomeGiftExpandablePhotoProps) {
  return (
    <ExpandableProductDialog
      src={src}
      alt={alt}
      title={title}
      productId={productId}
      description={description}
      tags={tags}
      price={price}
      ingredients={ingredients}
      desktopOnly
      triggerClassName={cn(
        'relative h-full w-full overflow-hidden rounded-[25px]',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 384px"
        className={IMAGE_HOVER_ZOOM}
      />
      <span className={TITLE_BADGE_CLASS}>{title}</span>
    </ExpandableProductDialog>
  )
}
