import {
  getHeroFanMobileY,
  HERO_FAN_LCP_INDEX,
  HERO_FAN_MOBILE_CARD_CLASS,
  HERO_FAN_SIZES,
  heroFanCards,
} from '@features/home/data/hero'
import { cn, resolveAssetPath } from '@lib/utils'
import Image from 'next/image'

/** Server Component: static Mobile fan (no framer-motion). */
export function HeroFanCardsMobile() {
  return (
    <div className="pointer-events-none flex items-end justify-center md:hidden">
      {heroFanCards.map((card, index) => (
        <div
          key={card.id}
          className="relative -ml-[70px] shrink-0 first:ml-0"
          style={{
            zIndex: card.zIndex,
            transform: `translateY(${getHeroFanMobileY(index, card.offsetY)}px) rotate(${card.rotate}deg)`,
          }}
        >
          <Image
            src={resolveAssetPath(card.filename)}
            width={272}
            height={430}
            alt={card.alt}
            priority={index === HERO_FAN_LCP_INDEX}
            sizes={HERO_FAN_SIZES}
            className={cn(
              'rounded-[10px] object-cover shadow-xl',
              HERO_FAN_MOBILE_CARD_CLASS[index],
            )}
          />
        </div>
      ))}
    </div>
  )
}
