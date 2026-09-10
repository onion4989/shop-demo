'use client'

import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'

const DOT_START = 48
const DOT_END = 12
const FLY_SEC = 0.7
const ARC_RATIO = 0.25
const ARC_STEPS = 24
const PINK = '#E4007E'
const CART_FLY_SEL = '[data-cart-fly-target]'

/** 弧飛行時のみ。遅延・薄さ・縮小で残像を作る */
const GHOSTS = [
  { delay: 0.04, opacity: 0.45, scale: 0.85 },
  { delay: 0.08, opacity: 0.28, scale: 0.7 },
  { delay: 0.12, opacity: 0.14, scale: 0.55 },
] as const

export type FlyPoint = { x: number; y: number }
export type FlyPath = 'arc' | 'line'

export function getCartFlyPoint(): FlyPoint | null {
  const nodes = document.querySelectorAll(CART_FLY_SEL)
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue
    const rect = node.getBoundingClientRect()
    // md:hidden / hidden 側は 0 サイズになる想定
    if (rect.width <= 0 || rect.height <= 0) continue
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return null
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 直線補間 + sin(πt) リフトで滑らかな上向き弧をサンプルする */
function sampleArc(dx: number, dy: number, lift: number, steps: number) {
  const xs: number[] = []
  const ys: number[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    xs.push(dx * t)
    ys.push(dy * t - lift * Math.sin(Math.PI * t))
  }
  return { xs, ys }
}

type CartFlyDotProps = {
  from: FlyPoint
  to: FlyPoint
  path?: FlyPath
  onDone: () => void
}

export function CartFlyDot({
  from,
  to,
  path = 'arc',
  onDone,
}: CartFlyDotProps) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const endScale = DOT_END / DOT_START
  const half = DOT_START / 2
  const showGhosts = path === 'arc'

  const pos =
    path === 'line'
      ? { x: dx, y: dy }
      : (() => {
          const lift = Math.abs(dx) * ARC_RATIO
          const { xs, ys } = sampleArc(dx, dy, lift, ARC_STEPS)
          return { x: xs, y: ys }
        })()

  const baseStyle = {
    left: from.x - half,
    top: from.y - half,
    width: DOT_START,
    height: DOT_START,
    backgroundColor: PINK,
  } as const

  return createPortal(
    <>
      {showGhosts
        ? GHOSTS.map((ghost, index) => (
            <motion.div
              key={index}
              aria-hidden
              className="pointer-events-none fixed z-80 rounded-full"
              style={baseStyle}
              initial={{ x: 0, y: 0, scale: ghost.scale, opacity: 0 }}
              animate={{
                x: pos.x,
                y: pos.y,
                scale: endScale * ghost.scale,
                opacity: [0, ghost.opacity, ghost.opacity, 0],
              }}
              transition={{
                duration: FLY_SEC,
                delay: ghost.delay,
                ease: 'easeInOut',
                opacity: {
                  duration: FLY_SEC,
                  delay: ghost.delay,
                  times: [0, 0.1, 0.85, 1],
                  ease: 'easeOut',
                },
              }}
            />
          ))
        : null}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-80 rounded-full"
        style={baseStyle}
        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        animate={{
          x: pos.x,
          y: pos.y,
          scale: endScale,
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: FLY_SEC,
          ease: 'easeInOut',
          opacity: {
            duration: FLY_SEC,
            times: [0, 0.95, 1],
            ease: 'easeOut',
          },
        }}
        onAnimationComplete={onDone}
      />
    </>,
    document.body,
  )
}
