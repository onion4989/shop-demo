'use client'

import { CartAddParticles } from '@features/cart/components/CartAddParticles'
import { motion } from 'framer-motion'
import { FaShoppingCart } from 'react-icons/fa'

const SHAKE = {
  rotate: [0, -12, 12, -8, 8, 0],
  scale: [1, 1.08, 1],
} as const

export function CartToggleButton({
  isOpen,
  count,
  addBumpSeq,
  onClick,
}: {
  isOpen: boolean
  count: number
  addBumpSeq: number
  onClick: () => void
}) {
  const showFx = addBumpSeq > 0

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? 'カートを閉じる' : 'カートを開く'}
      aria-expanded={isOpen}
      className="pointer-events-auto relative flex h-[110px] w-[44px] cursor-pointer items-center justify-center rounded-l-[10px] bg-[#E4007E] shadow-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
    >
      <span className="relative inline-flex size-12 items-center justify-center">
        {showFx ? <CartAddParticles key={`particles-${addBumpSeq}`} /> : null}
        <motion.span
          key={`shake-${addBumpSeq}`}
          className="relative z-10 inline-flex"
          initial={false}
          animate={showFx ? SHAKE : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <FaShoppingCart className="size-5 text-white" aria-hidden />
        </motion.span>
        {count > 0 ? (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[calc(100%-4px)] left-1/2 z-20 flex size-4 translate-x-[calc(-50%+2px)] select-none items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#E4007E]"
          >
            {count}
          </span>
        ) : null}
      </span>
    </button>
  )
}
