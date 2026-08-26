'use client'

import { MAX_QTY, formatYen, type CartRowData } from '@features/cart/pricing'
import Image from 'next/image'
import { FaChevronDown } from 'react-icons/fa'

const QTY_OPTIONS = Array.from({ length: MAX_QTY }, (_, index) => index + 1)

export const CART_ROW_GRID =
  'grid grid-cols-[28px_minmax(0,1fr)_58px_68px_40px] items-center gap-1.5'

type CartRowProps = {
  row: CartRowData
  locked: boolean
  onChangeQty: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
}

export function CartRow({ row, locked, onChangeQty, onRemove }: CartRowProps) {
  return (
    <div className={CART_ROW_GRID}>
      <div className="relative size-[28px] overflow-hidden rounded-[3px] bg-white/20">
        {row.thumbnailUrl ? (
          <Image
            src={row.thumbnailUrl}
            alt=""
            fill
            sizes="28px"
            className="object-cover"
          />
        ) : null}
      </div>

      <p className="truncate text-[13px] text-white" title={row.name}>
        {row.name}
      </p>

      <div className="relative">
        <select
          aria-label={`${row.name} の個数`}
          value={row.qty}
          disabled={locked}
          onChange={(event) => onChangeQty(row.productId, Number(event.target.value))}
          className="h-[22px] w-full appearance-none rounded-[3px] bg-white pr-4 pl-1.5 text-[13px] text-black disabled:opacity-60"
        >
          {QTY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FaChevronDown
          className="pointer-events-none absolute top-1/2 right-1 size-2 -translate-y-1/2 text-[#368FC7]"
          aria-hidden
        />
      </div>

      <p className="text-right text-[13px] text-white">{formatYen(row.subtotal)}</p>

      <button
        type="button"
        disabled={locked}
        onClick={() => onRemove(row.productId)}
        className="h-[18px] cursor-pointer rounded-[2px] bg-[#D2B48C]/70 text-[11px] font-bold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        削除
      </button>
    </div>
  )
}
