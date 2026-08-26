'use client'

import {
  CART_CHECKOUT_FORM_ID,
  CartCheckoutForm,
} from '@features/cart/components/CartCheckoutForm'
import { CartComplete } from '@features/cart/components/CartComplete'
import { CartGroupBlock } from '@features/cart/components/CartGroupBlock'
import { CartProgress } from '@features/cart/components/CartProgress'
import { formatYen, type CartSummary } from '@features/cart/pricing'
import type { CartStep } from '@features/cart/store'
import { cn } from '@lib/utils'
import { FaSpinner, FaTimes } from 'react-icons/fa'

type CartPanelProps = {
  summary: CartSummary
  step: CartStep
  busy: boolean
  inactive?: boolean
  onClose: () => void
  onChangeQty: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
  onProceed: () => void
  onBack: () => void
  onConfirm: () => void
}

function SummaryRow({
  label,
  amount,
  count,
}: {
  label: string
  amount: number
  count?: number
}) {
  return (
    <div className="flex h-9 items-center justify-between gap-2 rounded-[5px] bg-white px-3">
      <p className="text-[15px] font-bold text-black">{label}</p>
      <div className="flex items-baseline gap-3">
        {typeof count === 'number' ? (
          <p className="text-[18px] font-bold text-black">
            {count}
            <span className="text-[13px]">個</span>
          </p>
        ) : null}
        <p className="text-[18px] font-bold text-black">{formatYen(amount)}</p>
      </div>
    </div>
  )
}

export function CartPanel({
  summary,
  step,
  busy,
  inactive = false,
  onClose,
  onChangeQty,
  onRemove,
  onProceed,
  onBack,
  onConfirm,
}: CartPanelProps) {
  const locked = step !== 'cart'
  const isComplete = step === 'complete'
  const ctaLabel = step === 'form' ? '購入を確定する' : '購入画面へ進む'

  return (
    <aside
      className={cn(
        'flex h-dvh w-full shrink-0 flex-col bg-[#3B3B3B]/95 shadow-2xl backdrop-blur-md lg:w-[500px]',
        inactive ? 'pointer-events-none' : 'pointer-events-auto',
      )}
      role="dialog"
      aria-modal={locked}
      aria-hidden={inactive}
      aria-label="カート"
    >
      <div className="flex shrink-0 items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-[16px] font-bold text-white">カート</h2>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="カートを閉じる"
          className="flex size-8 items-center justify-center rounded-full bg-white/15 text-white transition-opacity hover:opacity-70 disabled:opacity-40"
        >
          <FaTimes className="size-3.5" aria-hidden />
        </button>
      </div>

      {isComplete ? (
        <>
          <CartComplete />
          <div className="shrink-0 border-t border-dashed border-white/40 px-5 pt-4 pb-5">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#E4007E] text-[18px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              買い物へ戻る
            </button>
          </div>
        </>
      ) : (
        <>
          {summary.hasDelivery ? (
            <div className="shrink-0 px-5 pb-4">
              <CartProgress
                freeShipping={summary.freeShipping}
                remaining={summary.remaining}
                progress={summary.progress}
              />
            </div>
          ) : null}

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-4">
            {summary.isEmpty ? (
              <p className="pt-8 text-center text-[14px] leading-relaxed text-white/80">
                カートにはまだ商品がありません。
                <br />
                商品の追加で反映されます。
              </p>
            ) : (
              summary.groups.map((group, index) => (
                <div
                  key={group.categoryId}
                  className={
                    index > 0 &&
                    group.fulfillment === 'pickup' &&
                    summary.groups[index - 1].fulfillment === 'delivery'
                      ? 'border-t border-dashed border-white/40 pt-4'
                      : undefined
                  }
                >
                  <CartGroupBlock
                    group={group}
                    locked={locked}
                    onChangeQty={onChangeQty}
                    onRemove={onRemove}
                  />
                </div>
              ))
            )}

            {step === 'form' ? (
              <CartCheckoutForm
                onBack={onBack}
                onConfirm={onConfirm}
                disabled={busy}
              />
            ) : null}
          </div>

          {summary.isEmpty ? null : (
            <div className="shrink-0 space-y-2.5 border-t border-dashed border-white/40 px-5 pt-4 pb-5">
              {summary.hasDelivery ? (
                <SummaryRow label="送料" amount={summary.shippingFee} />
              ) : null}
              <SummaryRow
                label="総合計"
                amount={summary.total}
                count={summary.totalCount}
              />
              <button
                type={step === 'form' ? 'submit' : 'button'}
                form={step === 'form' ? CART_CHECKOUT_FORM_ID : undefined}
                onClick={step === 'form' ? undefined : onProceed}
                disabled={busy}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#E4007E] text-[18px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <FaSpinner className="size-5 animate-spin" aria-hidden />
                ) : null}
                {ctaLabel}
              </button>
            </div>
          )}
        </>
      )}
    </aside>
  )
}
