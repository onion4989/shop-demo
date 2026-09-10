'use client'

import { motion } from 'framer-motion'
import { useId } from 'react'

const PINK = '#E4007E'
const WHITE = '#FFFFFF'
const YELLOW = '#FFE566'
const CENTER = 24
const VIEW = 48

type Particle = {
  id: number
  kind: 'dot' | 'star'
  fill: string
  stroke?: string
  x: number
  y: number
  size: number
}

const PARTICLES: Particle[] = [
  { id: 0, kind: 'dot', fill: WHITE, x: 32, y: -28, size: 7 },
  { id: 1, kind: 'star', fill: WHITE, stroke: PINK, x: -34, y: -26, size: 14 },
  { id: 2, kind: 'dot', fill: YELLOW, x: 28, y: 30, size: 6 },
  { id: 3, kind: 'star', fill: YELLOW, stroke: WHITE, x: -36, y: 22, size: 12 },
  { id: 4, kind: 'dot', fill: WHITE, x: 0, y: -38, size: 6 },
  { id: 5, kind: 'star', fill: WHITE, stroke: PINK, x: 38, y: 4, size: 13 },
  { id: 6, kind: 'dot', fill: YELLOW, x: -22, y: 34, size: 7 },
  { id: 7, kind: 'star', fill: WHITE, stroke: PINK, x: 14, y: 36, size: 11 },
  { id: 8, kind: 'dot', fill: WHITE, x: -30, y: -8, size: 6 },
  { id: 9, kind: 'star', fill: YELLOW, stroke: WHITE, x: 34, y: -18, size: 12 },
  { id: 10, kind: 'dot', fill: YELLOW, x: 18, y: -34, size: 6 },
  { id: 11, kind: 'star', fill: WHITE, stroke: PINK, x: -28, y: 30, size: 14 },
]

const STAR_PATH =
  'M0,-4 L1,-1 L4,-1 L1.5,1 L2.5,4 L0,2 L-2.5,4 L-1.5,1 L-4,-1 L-1,-1 Z'

const ORIGIN = `${CENTER}px ${CENTER}px`

const POP_FLY = {
  duration: 0.65,
  times: [0, 0.35, 1],
  ease: 'easeOut' as const,
}

const RING = {
  duration: 0.55,
  ease: 'easeOut' as const,
}

export function CartAddParticles() {
  const reactId = useId()
  const glowId = `cart-particle-glow-${reactId.replace(/:/g, '')}`

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className="pointer-events-none absolute inset-0 size-12 overflow-visible"
      aria-hidden
    >
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#FFFFFF" floodOpacity="0.85" />
        </filter>
      </defs>

      <motion.circle
        cx={CENTER}
        cy={CENTER}
        r={12}
        fill="none"
        stroke={WHITE}
        strokeWidth={2}
        initial={{ opacity: 0.9, scale: 0.5 }}
        animate={{ opacity: 0, scale: 2.4 }}
        transition={RING}
        style={{ transformOrigin: ORIGIN }}
      />

      {PARTICLES.map((p) =>
        p.kind === 'dot' ? (
          <motion.circle
            key={p.id}
            cx={CENTER}
            cy={CENTER}
            r={p.size / 2}
            fill={p.fill}
            filter={`url(#${glowId})`}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.3 }}
            animate={{
              opacity: [1, 1, 0],
              x: p.x,
              y: p.y,
              scale: [0.3, 1.2, 0.4],
            }}
            transition={POP_FLY}
            style={{ transformOrigin: ORIGIN }}
          />
        ) : (
          <motion.g
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.3 }}
            animate={{
              opacity: [1, 1, 0],
              x: p.x,
              y: p.y,
              scale: [0.3, 1.2, 0.4],
            }}
            transition={POP_FLY}
            style={{ transformOrigin: ORIGIN }}
            filter={`url(#${glowId})`}
          >
            <path
              d={STAR_PATH}
              fill={p.fill}
              stroke={p.stroke}
              strokeWidth={p.stroke ? 1.5 : 0}
              transform={`translate(${CENTER}, ${CENTER}) scale(${p.size / 8})`}
            />
          </motion.g>
        ),
      )}
    </svg>
  )
}
