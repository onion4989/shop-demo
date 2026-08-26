'use client'

import { useEffect } from 'react'

let locks = 0
let previousOverflow = ''

/** 複数のオーバーレイが重なっても最後の解除までロックを維持する。
 * 横ズレ防止は html の scrollbar-gutter: stable に任せる。
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    if (locks === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    locks += 1

    return () => {
      locks -= 1
      if (locks === 0) {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [active])
}
