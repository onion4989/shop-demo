'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useSyncExternalStore, type ReactNode } from 'react'

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'
const WORD_DELAY = 0.1
const VIEW_MARGIN = '0px 0px -200px 0px'

function subscribeReduce(onChange: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getReduce() {
  return window.matchMedia(REDUCE_QUERY).matches
}

type WordsPullSectionProps = {
  title: string
  titleClass: string
  className?: string
  children: ReactNode
}

export function WordsPullSection({
  title,
  titleClass,
  className,
  children,
}: WordsPullSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: VIEW_MARGIN })
  const reduce = useSyncExternalStore(subscribeReduce, getReduce, () => false)
  const words = title.split(' ')
  const shown = reduce || inView

  return (
    <section ref={sectionRef} className={className}>
      <h2 className={titleClass}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: 20, opacity: 0 }}
                animate={shown ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: i * WORD_DELAY }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </h2>
      {children}
    </section>
  )
}
