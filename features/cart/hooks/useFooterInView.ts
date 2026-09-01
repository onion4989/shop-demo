'use client'

import { useEffect, useState } from 'react'

const FOOTER_BAR_ID = 'site-footer-bar'
const MD_QUERY = '(min-width: 768px)'

export function useFooterInView() {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const footer = document.getElementById(FOOTER_BAR_ID)
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.matchMedia(MD_QUERY).matches) {
          setInView(false)
          return
        }
        setInView(entry.isIntersecting)
      },
      { root: null, threshold: 0, rootMargin: '0px' },
    )

    observer.observe(footer)

    const onResize = () => {
      if (window.matchMedia(MD_QUERY).matches) setInView(false)
    }
    window.addEventListener('resize', onResize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return inView
}
