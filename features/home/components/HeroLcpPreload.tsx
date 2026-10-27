import {
  HERO_FAN_LCP_INDEX,
  HERO_FAN_SIZES,
  heroFanCards,
} from '@features/home/data/hero'
import { resolveAssetPath } from '@lib/utils'
import { getImageProps } from 'next/image'

/** Preload the Mobile LCP fan image (店舗外観) via next/image props. */
export function HeroLcpPreload() {
  const card = heroFanCards[HERO_FAN_LCP_INDEX]
  const src = resolveAssetPath(card.filename)
  const { props } = getImageProps({
    src,
    width: 272,
    height: 430,
    sizes: HERO_FAN_SIZES,
    alt: '',
    priority: true,
  })

  return (
    <link
      rel="preload"
      as="image"
      href={props.src}
      imageSrcSet={props.srcSet}
      imageSizes={props.sizes}
      fetchPriority="high"
    />
  )
}
