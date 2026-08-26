'use client'

import { FaShoppingCart } from 'react-icons/fa'

export function CartToggleButton({
  isOpen,
  count,
  onClick,
}: {
  isOpen: boolean
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? 'カートを閉じる' : 'カートを開く'}
      aria-expanded={isOpen}
      className="pointer-events-auto relative flex h-[110px] w-[44px] cursor-pointer items-center justify-center rounded-l-[10px] bg-[#E4007E] shadow-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
    >
      <span className="relative inline-flex">
        <FaShoppingCart className="size-5 text-white" aria-hidden />
        {count > 0 ? (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 flex size-4 translate-x-[calc(-50%+2px)] select-none items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#E4007E]"
          >
            {count}
          </span>
        ) : null}
      </span>
    </button>
  )
}
