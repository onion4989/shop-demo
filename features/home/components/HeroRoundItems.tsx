'use client'

import {
  heroRoundImages,
  HERO_ITEM_STAGGER,
  HERO_ITEMS_START_DELAY,
} from '@features/home/data/hero'
import { resolveAssetPath } from '@lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'

function HeroBadge({ label, color }: { label: string; color: string }) {
  const width = 52
  const height = 23
  const svgHeight = 30

  return (
    <svg
      width={width}
      height={svgHeight}
      viewBox={`0 0 ${width} ${svgHeight}`}
      className="absolute -top-0.5 -right-1 z-40 overflow-visible"
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

export function HeroRoundItems() {
  return (
    <div className="relative z-30 mx-auto mb-8 flex w-fit items-center justify-center gap-5 md:mb-6 lg:mb-8">
      {heroRoundImages.map((image, index) => {
        const itemDelay = HERO_ITEMS_START_DELAY + index * HERO_ITEM_STAGGER

        return (
        <motion.div
          key={image.id}
          className="relative size-[100px] shrink-0 sm:size-[130px] md:size-[clamp(80px,calc(4.3403vw+46.667px),130px)]"
          initial={{ opacity: 0, y: 28, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.35, ease: 'easeOut', delay: itemDelay },
            y: { duration: 0.65, ease: 'backOut', delay: itemDelay },
            scale: { duration: 0.65, ease: 'backOut', delay: itemDelay },
          }}
        >
          <div className="size-full overflow-hidden rounded-full border-3 border-white">
            <Image
              src={resolveAssetPath(image.filename)}
              width={130}
              height={130}
              alt={image.alt}
              className="size-full object-cover"
            />
          </div>
          <HeroBadge label={image.badge.label} color={image.badge.color} />
        </motion.div>
        )
      })}
    </div>
  )
}
