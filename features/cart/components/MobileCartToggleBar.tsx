'use client'

import { formatYen } from '@features/cart/pricing'
import { cn } from '@lib/utils'
import { motion } from 'framer-motion'
import { FaShoppingCart } from 'react-icons/fa'

type MobileCartToggleBarProps = {
  isOpen: boolean
  hiddenByScroll: boolean
  count: number
  addBumpSeq: number
  freeShipping: boolean
  remaining: number
  progress: number
  onClick: () => void
}

const SHAKE = {
  rotate: [0, -12, 12, -8, 8, 0] as number[],
  scale: [1, 1.08, 1] as number[],
}

export function MobileCartToggleBar({
  isOpen,
  hiddenByScroll,
  count,
  addBumpSeq,
  freeShipping,
  remaining,
  progress,
  onClick,
}: MobileCartToggleBarProps) {
  const showFx = addBumpSeq > 0
  const barPct = freeShipping ? 100 : Math.round(progress * 100)

  return (
    <motion.div
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-[70] md:hidden"
      initial={false}
      animate={{ y: isOpen || hiddenByScroll ? '100%' : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={isOpen ? 'カートを閉じる' : 'カートを開く'}
        aria-expanded={isOpen}
        className="flex h-10 w-full cursor-pointer items-center justify-center bg-[#E4007E] px-3 text-white shadow-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        <span className="flex items-center justify-center gap-[3px]">
          <motion.span
            key={`shake-${addBumpSeq}`}
            className="inline-flex shrink-0"
            initial={false}
            animate={showFx ? SHAKE : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          >
            <FaShoppingCart className="size-5 shrink-0" aria-hidden />
          </motion.span>

          <span
            aria-hidden
            className="flex size-4 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#E4007E]"
          >
            {count}
          </span>

          <span className="flex shrink-0 items-baseline gap-1 text-[12px] leading-none">
            {freeShipping ? (
              '送料無料です'
            ) : (
              <>
                <span>送料無料まであと</span>
                <span className="text-[16px] font-bold">
                  {formatYen(remaining)}
                </span>
              </>
            )}
          </span>

          <span className="h-2 w-[98px] shrink-0 overflow-hidden rounded-[20px] bg-white">
            <span
              className={cn(
                'block h-full bg-[#72BFA3] transition-[width] duration-300',
                barPct >= 100 ? 'rounded-[20px]' : 'rounded-l-[20px]',
              )}
              style={{ width: `${barPct}%` }}
            />
          </span>
        </span>
      </button>
    </motion.div>
  )
}
