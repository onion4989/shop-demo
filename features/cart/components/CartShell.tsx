'use client'

import { CartBubble } from '@features/cart/components/CartBubble'
import { CartPanel } from '@features/cart/components/CartPanel'
import { CartToggleButton } from '@features/cart/components/CartToggleButton'
import { useCartHydration } from '@features/cart/hooks'
import {
  buildCartSummary,
  FREE_SHIPPING_THRESHOLD,
  linesHadDelivery,
} from '@features/cart/pricing'
import { useCartStore } from '@features/cart/store'
import type { CartCatalogItem } from '@features/cart/types'
import { useBodyScrollLock } from '@lib/useBodyScrollLock'
import { cn } from '@lib/utils'
import { motion } from 'framer-motion'
import { useCallback, useMemo, useSyncExternalStore } from 'react'

const PANEL_WIDTH = 500
const SLIDE_EASE = [0.22, 1, 0.36, 1] as const
const SLIDE_DURATION = 0.35
const MD_QUERY = '(min-width: 768px)'

function subscribeWidth(onChange: () => void) {
  const mq = window.matchMedia(MD_QUERY)
  window.addEventListener('resize', onChange)
  mq.addEventListener('change', onChange)
  return () => {
    window.removeEventListener('resize', onChange)
    mq.removeEventListener('change', onChange)
  }
}

function getClosedX() {
  if (window.matchMedia(MD_QUERY).matches) return PANEL_WIDTH
  return window.innerWidth
}

const INITIAL_BUBBLE = {
  freeShipping: false,
  remaining: FREE_SHIPPING_THRESHOLD,
  progress: 0,
} as const

export function CartShell({ catalog }: { catalog: CartCatalogItem[] }) {
  const hydrated = useCartHydration()

  const lines = useCartStore((state) => state.lines)
  const isOpen = useCartStore((state) => state.isOpen)
  const step = useCartStore((state) => state.step)
  const busy = useCartStore((state) => state.busy)
  const bubbleInitialMode = useCartStore((state) => state.bubbleInitialMode)
  const addBumpSeq = useCartStore((state) => state.addBumpSeq)
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
  const useInitialBubble = summary.isEmpty && bubbleInitialMode
  const showBubble =
    hydrated &&
    !isOpen &&
    step === 'cart' &&
    (useInitialBubble || (summary.hasDelivery && !summary.freeShipping))

  const markBubbleInitialIfEmpty = useCallback(() => {
    if (lines.length !== 1) return
    if (!linesHadDelivery(lines, catalogMap)) return
    useCartStore.setState({ bubbleInitialMode: true })
  }, [lines, catalogMap])

  const handleChangeQty = useCallback(
    (productId: string, qty: number) => {
      if (qty < 1) markBubbleInitialIfEmpty()
      setQty(productId, qty)
    },
    [markBubbleInitialIfEmpty, setQty],
  )

  const handleRemove = useCallback(
    (productId: string) => {
      if (lines.length === 1 && lines[0]?.productId === productId) {
        markBubbleInitialIfEmpty()
      }
      removeItem(productId)
    },
    [lines, markBubbleInitialIfEmpty, removeItem],
  )

  const bubbleMetrics = useInitialBubble
    ? INITIAL_BUBBLE
    : {
        freeShipping: summary.freeShipping,
        remaining: summary.remaining,
        progress: summary.progress,
      }

  useBodyScrollLock(isOpen)

  const closedX = useSyncExternalStore(
    subscribeWidth,
    getClosedX,
    () => PANEL_WIDTH,
  )

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

      {showBubble ? (
        <div className="pointer-events-auto fixed right-[10px] bottom-[10px] z-[65]">
          <CartBubble
            freeShipping={bubbleMetrics.freeShipping}
            remaining={bubbleMetrics.remaining}
            progress={bubbleMetrics.progress}
            onClick={openCart}
          />
        </div>
      ) : null}

      <div className="pointer-events-none fixed inset-y-0 right-0 z-[70] flex items-center">
        <motion.div
          className="pointer-events-none flex items-center"
          initial={false}
          animate={{ x: isOpen ? 0 : closedX }}
          transition={{ duration: SLIDE_DURATION, ease: SLIDE_EASE }}
        >
          <div className="relative shrink-0">
            <CartToggleButton
              isOpen={isOpen}
              count={summary.totalCount}
              addBumpSeq={hydrated ? addBumpSeq : 0}
              onClick={isOpen ? closeCart : openCart}
            />
          </div>
          <CartPanel
            summary={summary}
            step={step}
            busy={busy}
            inactive={!isOpen}
            onClose={closeCart}
            onChangeQty={handleChangeQty}
            onRemove={handleRemove}
            onProceed={proceedToForm}
            onBack={backToCart}
            onConfirm={confirmOrder}
          />
        </motion.div>
      </div>
    </>
  )
}
