'use client'

import { MAX_QTY } from '@features/cart/pricing'
import type { CartLine } from '@features/cart/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartStep = 'cart' | 'form' | 'complete'

const LOADING_MS = 1000

type CartState = {
  lines: CartLine[]
  isOpen: boolean
  step: CartStep
  busy: boolean
  addItem: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  removeItem: (productId: string) => void
  openCart: () => void
  closeCart: () => void
  proceedToForm: () => void
  backToCart: () => void
  confirmOrder: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      step: 'cart',
      busy: false,

      addItem: (productId) => {
        const { step, lines } = get()
        if (step !== 'cart') return

        const line = lines.find((entry) => entry.productId === productId)
        if (!line) {
          set({ lines: [...lines, { productId, qty: 1 }] })
          return
        }
        if (line.qty >= MAX_QTY) return

        set({
          lines: lines.map((entry) =>
            entry.productId === productId
              ? { ...entry, qty: entry.qty + 1 }
              : entry,
          ),
        })
      },

      setQty: (productId, qty) => {
        if (get().step !== 'cart') return
        if (qty < 1) {
          get().removeItem(productId)
          return
        }

        const next = Math.min(qty, MAX_QTY)
        set({
          lines: get().lines.map((entry) =>
            entry.productId === productId ? { ...entry, qty: next } : entry,
          ),
        })
      },

      removeItem: (productId) => {
        if (get().step !== 'cart') return
        set({
          lines: get().lines.filter((entry) => entry.productId !== productId),
        })
      },

      openCart: () => set({ isOpen: true }),

      closeCart: () => {
        if (get().busy) return
        set({ isOpen: false, step: 'cart' })
      },

      proceedToForm: () => {
        const { busy, step, lines } = get()
        if (busy || step !== 'cart' || lines.length === 0) return

        set({ busy: true })
        window.setTimeout(() => set({ busy: false, step: 'form' }), LOADING_MS)
      },

      backToCart: () => {
        if (get().busy) return
        set({ step: 'cart' })
      },

      confirmOrder: () => {
        const { busy, step } = get()
        if (busy || step !== 'form') return

        set({ busy: true })
        window.setTimeout(
          () => set({ busy: false, step: 'complete', lines: [] }),
          LOADING_MS,
        )
      },
    }),
    {
      name: 'shop-demo-cart',
      version: 1,
      skipHydration: true,
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
)

/** 開発時のみ: コンソールから step を強制変更して UI 確認 */
if (process.env.NODE_ENV === 'development' && typeof globalThis !== 'undefined') {
  ;(
    globalThis as typeof globalThis & {
      __CART_DEV__?: {
        getState: () => CartState
        setComplete: () => void
        setForm: () => void
        reset: () => void
      }
    }
  ).__CART_DEV__ = {
    getState: () => useCartStore.getState(),
    setComplete: () =>
      useCartStore.setState({
        step: 'complete',
        lines: [],
        isOpen: true,
        busy: false,
      }),
    setForm: () =>
      useCartStore.setState({
        step: 'form',
        isOpen: true,
        busy: false,
      }),
    reset: () =>
      useCartStore.setState({
        step: 'cart',
        isOpen: false,
        busy: false,
      }),
  }
}
