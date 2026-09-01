'use client'

import {
  getHeroFanInitialX,
  HERO_FAN_CARD_DURATION,
  HERO_FAN_CARD_STAGGER,
  heroFanCards,
} from '@features/home/data/hero'
import { cn, resolveAssetPath } from '@lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'

const MOBILE_CARD_CLASS = [
  'max-md:h-[175px] max-md:w-[110px]',
  'max-md:h-[182px] max-md:w-[115px]',
  'max-md:h-[175px] max-md:w-[110px]',
] as const

export function HeroFanCards() {
  return (
    <div className="pointer-events-none flex items-end justify-center">
      {heroFanCards.map((card, index) => (
        <motion.div
          key={card.id}
          className="relative -ml-[70px] shrink-0 first:ml-0 md:-ml-[clamp(82px,calc(5.004vw+43.922px),140px)]"
          style={{ zIndex: card.zIndex }}
          initial={{
            opacity: 0,
            scale: 0.88,
            rotate: 0,
            x: getHeroFanInitialX(index),
            y: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: card.rotate,
            x: 0,
            y: card.offsetY,
          }}
          transition={{
            duration: HERO_FAN_CARD_DURATION,
            delay: index * HERO_FAN_CARD_STAGGER,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Image
            src={resolveAssetPath(card.filename)}
            width={272}
            height={430}
            alt={card.alt}
            priority={index === 0}
            className={cn(
              'rounded-[10px] object-cover shadow-xl',
              MOBILE_CARD_CLASS[index],
              'md:h-[clamp(254px,calc(15.2778vw+136.667px),430px)] md:w-[clamp(160px,calc(9.7222vw+85.333px),272px)]',
            )}
          />
        </motion.div>
      ))}
    </div>
  )
}
