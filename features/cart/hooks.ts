'use client'

import { useCartStore } from '@features/cart/store'
import { useEffect, useState } from 'react'

/** localStorage の復元はマウント後に行い、SSR との差分を出さない */
export function useCartHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false
    void Promise.resolve(useCartStore.persist.rehydrate()).then(() => {
      if (!cancelled) setHydrated(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return hydrated
}
