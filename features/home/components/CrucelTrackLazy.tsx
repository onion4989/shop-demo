'use client'

import type { CrucelItem } from '@features/home/data/crucelTest'
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from 'react'

const MD_QUERY = '(min-width: 768px)'

function subscribeMd(onChange: () => void) {
  const mq = window.matchMedia(MD_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getIsMd() {
  return window.matchMedia(MD_QUERY).matches
}

type CrucelTrackLazyProps = {
  items: CrucelItem[]
}

export function CrucelTrackLazy({ items }: CrucelTrackLazyProps) {
  const isMd = useSyncExternalStore(subscribeMd, getIsMd, () => false)
  const [Track, setTrack] = useState<ComponentType<{
    items: CrucelItem[]
  }> | null>(null)

  useEffect(() => {
    if (!isMd) {
      setTrack(null)
      return
    }
    let alive = true
    void import('@features/home/components/CrucelTiltTrack').then((mod) => {
      if (alive) setTrack(() => mod.CrucelTiltTrack)
    })
    return () => {
      alive = false
    }
  }, [isMd])

  if (!isMd) return null
  // Reserve tilt-card height while the chunk loads (avoids pushing Gift / CLS)
  if (!Track) {
    return <div className="min-h-[344px] w-full" aria-hidden />
  }
  return <Track items={items} />
}
