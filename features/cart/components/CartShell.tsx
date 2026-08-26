'use client'

import { CartBubble } from '@features/cart/components/CartBubble'
import { CartPanel } from '@features/cart/components/CartPanel'
import { CartToggleButton } from '@features/cart/components/CartToggleButton'
import { useCartHydration } from '@features/cart/hooks'
import { buildCartSummary } from '@features/cart/pricing'
import { useCartStore } from '@features/cart/store'
import type { CartCatalogItem } from '@features/cart/types'
import { useBodyScrollLock } from '@lib/useBodyScrollLock'
import { cn } from '@lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

const PANEL_WIDTH = 500
const SLIDE_EASE = [0.22, 1, 0.36, 1] as const
const SLIDE_DURATION = 0.35

export function CartShell({ catalog }: { catalog: CartCatalogItem[] }) {
  const hydrated = useCartHydration()
  const hasSlidRef = useRef(false)
  const [bubbleReady, setBubbleReady] = useState(false)

  const lines = useCartStore((state) => state.lines)
  const isOpen = useCartStore((state) => state.isOpen)
  const step = useCartStore((state) => state.step)
  const busy = useCartStore((state) => state.busy)
  const openCart = useCartStore((state) => state.openCart)
  const closeCart = useCartStore((state) => state.closeCart)
  const setQty = useCartStore((state) => state.setQty)
  const removeItem = useCartStore((state) => state.removeItem)
  const proceedToForm = useCartStore((state) => state.proceedToForm)
  const backToCart = useCartStore((state) => state.backToCart)
  const confirmOrder = useCartStore((state) => state.confirmOrder)

  const catalogMap = useMemo(
    () => new Map(catalog.map((item) => [item.productId, item])),
    [catalog],
  )
  const summary = buildCartSummary(hydrated ? lines : [], catalogMap)
  const locked = step !== 'cart'
  const wantsBubble = !summary.isEmpty && summary.hasDelivery
  const showBubble = !isOpen && wantsBubble && bubbleReady

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (isOpen) {
      setBubbleReady(false)
      hasSlidRef.current = true
      return
    }
    if (hasSlidRef.current) {
      setBubbleReady(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (hydrated && !isOpen && wantsBubble && !hasSlidRef.current) {
      setBubbleReady(true)
    }
  }, [hydrated, isOpen, wantsBubble])

  const handleSlideComplete = () => {
    if (!isOpen && wantsBubble) {
      setBubbleReady(true)
    }
  }

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="カートを閉じる"
          className={cn(
            'fixed inset-0 z-[60] cursor-default',
            locked ? 'bg-black/60' : 'bg-transparent',
          )}
          onClick={closeCart}
        />
      ) : null}

      <div className="pointer-events-none fixed inset-y-0 right-0 z-[70] flex items-center">
        <div className="relative">
          {showBubble ? (
            <div className="pointer-events-auto absolute right-0 bottom-full z-10 mb-[15px]">
              <CartBubble
                freeShipping={summary.freeShipping}
                remaining={summary.remaining}
                progress={summary.progress}
                onClick={openCart}
              />
            </div>
          ) : null}

          <motion.div
            className="pointer-events-none flex items-center"
            initial={false}
            animate={{ x: isOpen ? 0 : PANEL_WIDTH }}
            transition={{ duration: SLIDE_DURATION, ease: SLIDE_EASE }}
            onAnimationComplete={handleSlideComplete}
          >
            <CartToggleButton
              isOpen={isOpen}
              count={summary.totalCount}
              onClick={isOpen ? closeCart : openCart}
            />
            <CartPanel
              summary={summary}
              step={step}
              busy={busy}
              inactive={!isOpen}
              onClose={closeCart}
              onChangeQty={setQty}
              onRemove={removeItem}
              onProceed={proceedToForm}
              onBack={backToCart}
              onConfirm={confirmOrder}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}
