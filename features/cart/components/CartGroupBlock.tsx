'use client'

import { CART_ROW_GRID, CartRow } from '@features/cart/components/CartRow'
import { formatYen, type CartGroup } from '@features/cart/pricing'

type CartGroupBlockProps = {
  group: CartGroup
  locked: boolean
  onChangeQty: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
}

export function CartGroupBlock({
  group,
  locked,
  onChangeQty,
  onRemove,
}: CartGroupBlockProps) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-2 pb-1.5">
        <h3 className="min-w-0 truncate text-[15px] font-bold text-[#F6F6F6]">
          {group.categoryName} /{' '}
          <span className="font-normal">
            {group.fulfillment === 'delivery' ? '配送' : '店舗受け取り'}
          </span>
        </h3>
        <p className="shrink-0 text-[18px] font-bold text-white">
          {formatYen(group.subtotal)}
        </p>
      </div>

      <div className="space-y-2 rounded-[5px] bg-white/10 px-2.5 py-2.5">
        <div className={`${CART_ROW_GRID} text-[12px] font-bold text-white`}>
          <span className="col-span-2">商品名</span>
          <span>個数</span>
          <span className="text-right">金額</span>
          <span />
        </div>

        {group.rows.map((row) => (
          <CartRow
            key={row.productId}
            row={row}
            locked={locked}
            onChangeQty={onChangeQty}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
}
