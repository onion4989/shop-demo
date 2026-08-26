'use client'

import { CartProgress } from '@features/cart/components/CartProgress'
import { motion } from 'framer-motion'

type CartBubbleProps = {
  freeShipping: boolean
  remaining: number
  progress: number
  onClick: () => void
}

export function CartBubble({
  freeShipping,
  remaining,
  progress,
  onClick,
}: CartBubbleProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      className="relative w-[150px] rounded-[10px] bg-[#3B3B3B]/95 px-3 py-2.5 text-left shadow-lg backdrop-blur-md transition-opacity hover:opacity-90"
    >
      <CartProgress
        freeShipping={freeShipping}
        remaining={remaining}
        progress={progress}
        compact
      />
      <span
        className="absolute -bottom-1.5 right-4 size-3 rotate-45 bg-[#3B3B3B]/95"
        aria-hidden
      />
    </motion.button>
  )
}
