'use client'

import { formatYen } from '@features/cart/pricing'
import { cn } from '@lib/utils'
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
  const barPct = freeShipping ? 100 : Math.round(progress * 100)

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={freeShipping ? '送料無料。カートを開く' : '送料無料までの残額。カートを開く'}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2 }}
      className="flex h-[80px] w-[120px] cursor-pointer flex-col items-stretch rounded-[5px] bg-[#6B4226] px-[11px] pt-[11px] pb-[13px] text-white shadow-lg transition-opacity hover:opacity-90"
    >
      {!freeShipping ? (
        <div className="flex shrink-0 flex-col items-center gap-[5px] leading-none">
          <p className="text-[12px] font-normal">送料無料まであと</p>
          <p className="text-[20px] font-bold">{formatYen(remaining)}</p>
        </div>
      ) : (
        <p className="shrink-0 text-center text-[20px] leading-none font-bold">
          ￥5000以上で送料無料
        </p>
      )}

      <div className="mt-[11px] h-[8px] w-full shrink-0 overflow-hidden rounded-[20px] bg-white">
        <div
          className={cn(
            'h-full bg-[#72BFA3] transition-[width] duration-300',
            barPct >= 100 ? 'rounded-[20px]' : 'rounded-l-[20px]',
          )}
          style={{ width: `${barPct}%` }}
        />
      </div>
    </motion.button>
  )
}
