'use client'

import {
  HERO_FAN_DESKTOP_CARD_CLASS,
  HERO_FAN_SIZES,
  heroFanCards,
} from '@features/home/data/hero'
import { cn, resolveAssetPath } from '@lib/utils'
import Image from 'next/image'
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from 'react'

const MD_QUERY = '(min-width: 768px)'

function subscribeMd(onChange: () => void) {
  const mq = window.matchMedia(MD_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getIsMd() {
  return window.matchMedia(MD_QUERY).matches
}

/** Static final pose while the animated Desktop chunk loads (md+ only). */
function DesktopFanPlaceholder() {
  return (
    <div className="pointer-events-none hidden items-end justify-center md:flex">
      {heroFanCards.map((card) => (
        <div
          key={card.id}
          className="relative -ml-[70px] shrink-0 first:ml-0 md:-ml-[clamp(82px,calc(5.004vw+43.922px),140px)]"
          style={{
            zIndex: card.zIndex,
            transform: `translateY(${card.offsetY}px) rotate(${card.rotate}deg)`,
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
        </div>
      ))}
    </div>
  )
}

/**
 * Load animated Desktop fans only on md+.
 * useEffect: dynamic import of framer-motion fan (external chunk).
 */
export function HeroFanCardsDesktopLazy() {
  const isMd = useSyncExternalStore(subscribeMd, getIsMd, () => false)
  const [Track, setTrack] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (!isMd) {
      setTrack(null)
      return
    }
    let alive = true
    void import('@features/home/components/HeroFanCardsDesktop').then(
      (mod) => {
        if (alive) setTrack(() => mod.HeroFanCardsDesktop)
      },
    )
    return () => {
      alive = false
    }
  }, [isMd])

  if (!isMd) return null
  if (!Track) return <DesktopFanPlaceholder />
  return <Track />
}
