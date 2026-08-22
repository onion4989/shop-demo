'use client'

import { cn } from '@lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { FaShoppingCart } from 'react-icons/fa'

const DESKTOP_WIDTH = 588
const DESKTOP_IMAGE_HEIGHT = 300
const DESKTOP_TEXT_HEIGHT = 200
const MOBILE_IMAGE_HEIGHT = 196
const MOBILE_TEXT_HEIGHT = 210
const SIDE_GUTTER = 16

const IMAGE_DURATION = 0.55
const TEXT_DURATION = 0.4
const EASE = [0.22, 1, 0.36, 1] as const

const TITLE_BADGE_DESKTOP =
  'flex items-center justify-center rounded-[25px] bg-white/25 px-2.5 py-2 text-sm font-bold text-[#E4007E] backdrop-blur-md'

const TITLE_BADGE_MOBILE =
  'min-w-0 max-w-[171px] rounded-[24px] bg-white/25 px-2.5 py-2 text-[14px] font-bold leading-normal break-words text-[#E4007E] backdrop-blur-md'

type Rect = {
  top: number
  left: number
  width: number
  height: number
}

type CloseMotion = 'intro' | 'thumb-crossfade'

type Phase =
  | 'closed'
  | 'expanding'
  | 'open'
  | 'collapsing-text'
  | 'collapsing-image'

type ExpandLayout = {
  width: number
  imageHeight: number
  textHeight: number
  cardHeight: number
  isDesktop: boolean
}

function isDesktopViewport() {
  return window.matchMedia('(min-width: 1024px)').matches
}

function getExpandLayout(): ExpandLayout {
  if (isDesktopViewport()) {
    return {
      width: DESKTOP_WIDTH,
      imageHeight: DESKTOP_IMAGE_HEIGHT,
      textHeight: DESKTOP_TEXT_HEIGHT,
      cardHeight: DESKTOP_IMAGE_HEIGHT + DESKTOP_TEXT_HEIGHT,
      isDesktop: true,
    }
  }

  const width = Math.max(0, window.innerWidth - SIDE_GUTTER * 2)
  return {
    width,
    imageHeight: MOBILE_IMAGE_HEIGHT,
    textHeight: MOBILE_TEXT_HEIGHT,
    cardHeight: MOBILE_IMAGE_HEIGHT + MOBILE_TEXT_HEIGHT,
    isDesktop: false,
  }
}

function getCenteredCardRect(layout: ExpandLayout): Rect {
  return {
    width: layout.width,
    height: layout.cardHeight,
    left: Math.max(
      SIDE_GUTTER,
      (window.innerWidth - layout.width) / 2,
    ),
    top: Math.max(
      SIDE_GUTTER,
      (window.innerHeight - layout.cardHeight) / 2,
    ),
  }
}

function getCardRect(
  phase: Phase,
  origin: Rect,
  layout: ExpandLayout,
): Rect {
  const dest = getCenteredCardRect(layout)
  const destImage = { ...dest, height: layout.imageHeight }

  switch (phase) {
    case 'expanding':
    case 'collapsing-text':
      return destImage
    case 'open':
      return dest
    case 'collapsing-image':
    case 'closed':
      return origin
  }
}

export type ExpandableProductDialogProps = {
  src: string
  alt: string
  title: string
  description: string
  tags: string[]
  price: string
  ingredients: string
  desktopOnly?: boolean
  triggerClassName?: string
  onOpenChange?: (open: boolean) => void
  closeMotion?: CloseMotion
  thumbPreview?: ReactNode
  children: ReactNode
}

export function ExpandableProductDialog({
  src,
  alt,
  title,
  description,
  tags,
  price,
  ingredients,
  desktopOnly = false,
  triggerClassName,
  onOpenChange,
  closeMotion = 'intro',
  thumbPreview,
  children,
}: ExpandableProductDialogProps) {
  const titleId = useId()
  const thumbRef = useRef<HTMLButtonElement>(null)
  const phaseRef = useRef<Phase>('closed')
  const imageHeightRef = useRef(DESKTOP_IMAGE_HEIGHT)
  const [phase, setPhase] = useState<Phase>('closed')
  const [origin, setOrigin] = useState<Rect | null>(null)
  const [, setLayoutTick] = useState(0)

  phaseRef.current = phase
  const isOpen = phase !== 'closed'
  const layout = typeof window === 'undefined' ? null : getExpandLayout()
  if (layout) {
    imageHeightRef.current = layout.imageHeight
  }

  const open = useCallback(() => {
    if (desktopOnly && !isDesktopViewport()) return
    const el = thumbRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setOrigin({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
    setPhase('expanding')
  }, [desktopOnly])

  const dismiss = useCallback(() => {
    const current = phaseRef.current
    if (closeMotion === 'thumb-crossfade') {
      if (current === 'open' || current === 'expanding') {
        setPhase('collapsing-image')
      }
      return
    }
    if (current === 'open') {
      setPhase('collapsing-text')
      return
    }
    if (current === 'expanding') {
      setPhase('collapsing-image')
    }
  }, [closeMotion])

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  useEffect(() => {
    if (!isOpen) return

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight

    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`

    const syncLayout = () => setLayoutTick((tick) => tick + 1)
    window.addEventListener('resize', syncLayout)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      window.removeEventListener('resize', syncLayout)
    }
  }, [isOpen])

  const handleCardAnimationComplete = useCallback(
    (definition: unknown) => {
      if (
        typeof definition !== 'object' ||
        definition === null ||
        Array.isArray(definition) ||
        !('height' in definition)
      ) {
        return
      }

      const height = (definition as { height?: number }).height
      const current = phaseRef.current
      const imageHeight = imageHeightRef.current

      if (current === 'expanding' && height === imageHeight) {
        setPhase('open')
      } else if (current === 'collapsing-text' && height === imageHeight) {
        setPhase('collapsing-image')
      } else if (current === 'collapsing-image' && height === origin?.height) {
        setPhase('closed')
      }
    },
    [origin],
  )

  const collapsingThumb =
    closeMotion === 'thumb-crossfade' && phase === 'collapsing-image'
  const imageFillsCard =
    phase === 'expanding' ||
    (phase === 'collapsing-image' && closeMotion === 'intro')
  const showExpandedText =
    phase === 'open' || collapsingThumb
  const target =
    origin && layout ? getCardRect(phase, origin, layout) : null
  const cardDuration =
    phase === 'open' || phase === 'collapsing-text'
      ? TEXT_DURATION
      : IMAGE_DURATION
  const isDesktop = layout?.isDesktop ?? true
  const imageHeight = layout?.imageHeight ?? DESKTOP_IMAGE_HEIGHT
  const textHeight = layout?.textHeight ?? DESKTOP_TEXT_HEIGHT

  return (
    <>
      <button
        ref={thumbRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={open}
        className={cn(
          'appearance-none border-0 bg-transparent p-0 text-left',
          desktopOnly
            ? 'max-lg:pointer-events-none lg:cursor-pointer'
            : 'cursor-pointer',
          isOpen ? 'invisible' : 'group',
          triggerClassName,
        )}
      >
        {children}
      </button>

      {isOpen && origin && target
        ? createPortal(
            <div
              className="fixed inset-0 z-60 cursor-pointer"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={dismiss}
            >
              <motion.div
                className="absolute inset-0 bg-black/60"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: phase === 'collapsing-image' ? 0 : 1,
                }}
                transition={{ duration: IMAGE_DURATION, ease: EASE }}
              />
              <motion.div
                className={cn(
                  'absolute overflow-hidden shadow-2xl',
                  collapsingThumb
                    ? 'rounded-[10px]'
                    : isDesktop
                      ? 'rounded-[25px]'
                      : 'rounded-[15px]',
                )}
                initial={origin}
                animate={target}
                transition={{ duration: cardDuration, ease: EASE }}
                onAnimationComplete={handleCardAnimationComplete}
              >
                <div className="relative size-full">
                  <motion.div
                    className={cn(
                      collapsingThumb
                        ? 'absolute inset-0 overflow-hidden'
                        : 'flex h-full flex-col',
                    )}
                    animate={{ opacity: collapsingThumb ? 0 : 1 }}
                    transition={{ duration: IMAGE_DURATION, ease: EASE }}
                  >
                <div
                  className="relative w-full"
                  style={{
                    height: imageFillsCard ? '100%' : imageHeight,
                  }}
                >
                  {src ? (
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes={
                        isDesktop ? `${DESKTOP_WIDTH}px` : '100vw'
                      }
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full bg-[#D2B48CB4]" />
                  )}
                  <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4 sm:gap-3">
                    <span
                      id={titleId}
                      className={
                        isDesktop ? TITLE_BADGE_DESKTOP : TITLE_BADGE_MOBILE
                      }
                    >
                      {title}
                    </span>
                    <button
                      type="button"
                      className={cn(
                        'flex shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-[#E4007E] text-[14px] font-bold text-white',
                        isDesktop
                          ? 'h-[45px] w-[155px]'
                          : 'h-[45px] w-[146px]',
                      )}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <FaShoppingCart
                        className={
                          isDesktop
                            ? 'size-[22px] shrink-0'
                            : 'size-[18px] shrink-0'
                        }
                        aria-hidden
                      />
                      カートに入れる
                    </button>
                  </div>
                </div>
                <motion.div
                  className="overflow-hidden bg-white"
                  initial={{ height: 0 }}
                  animate={{
                    height: showExpandedText ? textHeight : 0,
                  }}
                  transition={{ duration: TEXT_DURATION, ease: EASE }}
                >
                  {isDesktop ? (
                    <div className="flex h-[200px] flex-col justify-between px-[19px] py-3">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-[5px] bg-[#6B4226] px-2 py-0.5 text-xs font-bold text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-base leading-[25px] text-black">
                        {description}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <p className="h-14 w-96 overflow-hidden rounded-[10px] bg-[#E0E0E0] px-3.5 py-2 text-[12px] leading-5 text-black">
                          {ingredients}
                        </p>
                        <p className="shrink-0 text-[32px] font-bold text-black">
                          {price}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[210px] flex-col justify-between px-3 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-[5px] bg-[#6B4226] px-2 py-0.5 text-xs font-bold text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-[14px] leading-[1.15] text-black">
                        {description}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <p className="h-11 min-w-0 flex-1 overflow-hidden rounded-[10px] bg-[#E6E6E6] px-2.5 py-1.5 text-[10px] leading-tight text-black">
                          {ingredients}
                        </p>
                        <p className="shrink-0 text-[20px] font-bold text-black">
                          {price}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
                  </motion.div>
                  {collapsingThumb && thumbPreview ? (
                    <motion.div
                      className="pointer-events-none absolute inset-0 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: IMAGE_DURATION, ease: EASE }}
                      aria-hidden
                    >
                      {thumbPreview}
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
