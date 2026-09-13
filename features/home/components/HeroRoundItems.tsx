'use client'

import {
  HeroCircleThumb,
  HeroRoundExpandablePhoto,
} from '@features/home/components/HeroRoundExpandablePhoto'
import {
  type HeroBadge,
  HERO_ITEM_STAGGER,
  HERO_ITEMS_START_DELAY,
} from '@features/home/data/hero'
import { motion } from 'framer-motion'
import { useSyncExternalStore } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'
const MOBILE_ITEM_LIMIT = 3

function subscribeMobile(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getIsMobile() {
  return window.matchMedia(MOBILE_QUERY).matches
}

export type HeroRoundItem = {
  id: string
  src: string
  alt: string
  badge: HeroBadge
  interactive?: boolean
  productId?: string
  title?: string
  categoryName?: string
  description?: string
  tags?: string[]
  price?: string
  ingredients?: string
}

function HeroBadgeMark({ label, color }: HeroBadge) {
  const width = 52
  const height = 23
  const svgHeight = 30

  return (
    <svg
      width={width}
      height={svgHeight}
      viewBox={`0 0 ${width} ${svgHeight}`}
      className="pointer-events-none absolute -top-0.5 -right-1 z-40 origin-top-right scale-75 overflow-visible md:scale-100"
      role="img"
      aria-label={label}
    >
      <rect x="0" y="0" width={width} height={height} rx="3" fill={color} />
      <path d={`M4 ${height} L1 ${height + 5} L16 ${height} Z`} fill={color} />
      <text
        x={width / 2}
        y={height / 2 + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui, 'Noto Sans JP', sans-serif"
      >
        {label}
      </text>
    </svg>
  )
}

type HeroRoundItemsProps = {
  items: HeroRoundItem[]
}

export function HeroRoundItems({ items }: HeroRoundItemsProps) {
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getIsMobile,
    () => false,
  )
  const visibleItems = isMobile ? items.slice(0, MOBILE_ITEM_LIMIT) : items

  return (
    <div className="relative z-30 mx-auto flex w-full items-end justify-center gap-3 px-[50px] md:mb-6 md:w-fit md:max-w-none md:justify-center md:gap-5 md:px-0 lg:mb-8">
      {visibleItems.map((item, index) => {
        const itemDelay = HERO_ITEMS_START_DELAY + index * HERO_ITEM_STAGGER
        const canOpen =
          item.interactive !== false &&
          Boolean(item.productId && item.title != null)

        return (
          <motion.div
            key={item.id}
            className="relative size-20 shrink-0 md:size-[clamp(80px,calc(4.3403vw+46.667px),130px)]"
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.35, ease: 'easeOut', delay: itemDelay },
              y: { duration: 0.65, ease: 'backOut', delay: itemDelay },
              scale: { duration: 0.65, ease: 'backOut', delay: itemDelay },
            }}
          >
            {canOpen ? (
              <HeroRoundExpandablePhoto
                src={item.src}
                alt={item.alt}
                title={item.title!}
                productId={item.productId!}
                categoryName={item.categoryName}
                description={item.description ?? ''}
                tags={item.tags ?? []}
                price={item.price ?? ''}
                ingredients={item.ingredients ?? ''}
              />
            ) : (
              <HeroCircleThumb src={item.src} alt={item.alt} />
            )}
            <HeroBadgeMark label={item.badge.label} color={item.badge.color} />
          </motion.div>
        )
      })}
    </div>
  )
}
