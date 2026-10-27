'use client'

import {
  getHeroTextDelay,
  HERO_MOBILE_LIMIT,
  HERO_MOBILE_QUERY,
} from '@features/home/data/hero'
import { cn } from '@/lib/utils'
import { LazyMotion, domAnimation, m, useInView } from 'framer-motion'
import { useRef, useSyncExternalStore } from 'react'

function subscribeMobile(onChange: () => void) {
  const mq = window.matchMedia(HERO_MOBILE_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getIsMobile() {
  return window.matchMedia(HERO_MOBILE_QUERY).matches
}

type LettersPullUpProps = {
  text: string
  itemCount: number
  className?: string
}

export function LettersPullUp({
  text,
  itemCount,
  className = '',
}: LettersPullUpProps) {
  const letters = text.split('')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getIsMobile,
    () => false,
  )
  const shown = isMobile ? Math.min(itemCount, HERO_MOBILE_LIMIT) : itemCount
  const textDelay = getHeroTextDelay(shown)
  const pullupVariant = {
    initial: { y: 10, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: textDelay + i * 0.05,
      },
    }),
  }

  return (
    <>
      {/* Mobile: static title (no letter pull-up) */}
      <div className="flex justify-center md:hidden">
        {letters.map((letter, i) => (
          <span key={`m-${letter}-${i}`} className={cn(className)}>
            {letter === ' ' ? <span>&nbsp;</span> : letter}
          </span>
        ))}
      </div>

      {/* md+: keep letter pull-up */}
      <LazyMotion features={domAnimation} strict>
        <div ref={ref} className="hidden justify-center md:flex">
          {letters.map((letter, i) => (
            <m.span
              key={`d-${letter}-${i}`}
              variants={pullupVariant}
              initial="initial"
              animate={isInView ? 'animate' : 'initial'}
              custom={i}
              className={cn(className)}
            >
              {letter === ' ' ? <span>&nbsp;</span> : letter}
            </m.span>
          ))}
        </div>
      </LazyMotion>
    </>
  )
}
