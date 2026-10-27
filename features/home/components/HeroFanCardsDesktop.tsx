'use client'

import {
  getHeroFanInitialX,
  HERO_FAN_CARD_DURATION,
  HERO_FAN_CARD_STAGGER,
  HERO_FAN_DESKTOP_CARD_CLASS,
  HERO_FAN_SIZES,
  heroFanCards,
} from '@features/home/data/hero'
import { cn, resolveAssetPath } from '@lib/utils'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import Image from 'next/image'

/** Client: Desktop fan entrance animation only. */
export function HeroFanCardsDesktop() {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="pointer-events-none hidden items-end justify-center md:flex">
        {heroFanCards.map((card, index) => (
          <m.div
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
              sizes={HERO_FAN_SIZES}
              className={cn(
                'rounded-[10px] object-cover shadow-xl',
                HERO_FAN_DESKTOP_CARD_CLASS,
              )}
            />
          </m.div>
        ))}
      </div>
    </LazyMotion>
  )
}
