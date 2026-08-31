'use client'

import { ExpandableProductDialog } from '@features/home/components/ExpandableProductDialog'
import { IMAGE_HOVER_ZOOM } from '@lib/imageClasses'
import { cn } from '@lib/utils'
import Image from 'next/image'

const THUMB_CLASS =
  'relative block size-40 overflow-hidden rounded-full border-2 border-white md:size-[120px] lg:size-40'

const IMAGE_SIZES =
  '(min-width: 1024px) 160px, (min-width: 768px) 120px, 160px'

type ItemCircleThumbProps = {
  src: string
  alt: string
}

function ItemCircleThumb({ src, alt }: ItemCircleThumbProps) {
  return (
    <div className="relative size-full overflow-hidden rounded-full border-2 border-white">
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
}: HomeItemsExpandablePhotoProps) {
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
