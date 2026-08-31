'use client'

import { CategoryTag } from '@features/catalog/components/CategoryTag'
import { MAX_QTY, isDeliveryProductId } from '@features/cart/pricing'
import { useCartStore } from '@features/cart/store'
import {
  addExpandCloser,
  removeExpandCloser,
} from '@lib/expandDialogCloser'
import { useBodyScrollLock } from '@lib/useBodyScrollLock'
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
const TABLET_WIDTH = 480
const TABLET_IMAGE_HEIGHT = 240
const MOBILE_IMAGE_HEIGHT = 196
const MOBILE_TEXT_HEIGHT = 210
const SIDE_GUTTER = 16

const IMAGE_DURATION = 0.55
const TEXT_DURATION = 0.4
const CLOSE_IMAGE_DUR = 0.38
const CLOSE_TEXT_DUR = 0.28
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

type ThumbShape = 'rect' | 'circle'

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

type FittedLayout = ExpandLayout & {
  top: number
  left: number
  maxHeight: number
}

function matchesMin(px: number) {
  return window.matchMedia(`(min-width: ${px}px)`).matches
}

function getExpandLayout(): ExpandLayout {
  if (matchesMin(1024)) {
    return {
      width: DESKTOP_WIDTH,
      imageHeight: DESKTOP_IMAGE_HEIGHT,
      textHeight: MOBILE_TEXT_HEIGHT,
      cardHeight: DESKTOP_IMAGE_HEIGHT + MOBILE_TEXT_HEIGHT,
      isDesktop: true,
    }
  }

  if (matchesMin(768)) {
    return {
      width: TABLET_WIDTH,
      imageHeight: TABLET_IMAGE_HEIGHT,
      textHeight: MOBILE_TEXT_HEIGHT,
      cardHeight: TABLET_IMAGE_HEIGHT + MOBILE_TEXT_HEIGHT,
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

function getViewportFittedLayout(
  layout: ExpandLayout,
  withText: boolean,
): FittedLayout {
  const maxHeight = Math.max(0, window.innerHeight - SIDE_GUTTER * 2)
  const textH = withText ? layout.textHeight : 0
  let imageH = layout.imageHeight
  let scaledTextH = textH
  let totalH = imageH + textH

  if (totalH > maxHeight && totalH > 0) {
    const scale = maxHeight / totalH
    imageH = Math.max(1, Math.floor(imageH * scale))
    scaledTextH = Math.max(1, Math.floor(textH * scale))
    totalH = imageH + scaledTextH
  }

  const left = Math.max(SIDE_GUTTER, (window.innerWidth - layout.width) / 2)
  const top = Math.max(SIDE_GUTTER, (window.innerHeight - totalH) / 2)

  return {
    ...layout,
    imageHeight: imageH,
    textHeight: scaledTextH,
    cardHeight: totalH,
    maxHeight,
    top,
    left,
  }
}

function getCenteredImageRect(layout: ExpandLayout): Rect {
  const fitted = getViewportFittedLayout(layout, false)
  return {
    width: fitted.width,
    height: fitted.imageHeight,
    left: fitted.left,
    top: fitted.top,
  }
}

/** getBoundingClientRect は端数を返すため、完了判定は許容誤差付きで行う */
function isSameHeight(a: number | undefined, b: number | undefined) {
  if (typeof a !== 'number' || typeof b !== 'number') return false
  return Math.abs(a - b) < 2
}

function getCardRect(
  phase: Phase,
  origin: Rect,
  layout: ExpandLayout,
): Rect {
  const destImage = getCenteredImageRect(layout)

  switch (phase) {
    case 'expanding':
    case 'collapsing-text':
      return destImage
    case 'open': {
      const fitted = getViewportFittedLayout(layout, true)
      return {
        width: fitted.width,
        height: fitted.cardHeight,
        left: fitted.left,
        top: fitted.top,
      }
    }
    case 'collapsing-image':
    case 'closed':
      return origin
  }
}

function DialogTagRow({
  categoryName,
  tags,
  gapClassName,
}: {
  categoryName?: string
  tags: string[]
  gapClassName: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center', gapClassName)}>
      {categoryName ? <CategoryTag name={categoryName} /> : null}
      {categoryName && tags.length > 0 ? (
        <span className="text-xs font-bold text-black" aria-hidden>
          /
        </span>
      ) : null}
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-[5px] bg-[#6B4226] px-2 py-0.5 text-xs font-bold text-white"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

function getCardRadiusClass(
  thumbShape: ThumbShape,
  phase: Phase,
  collapsingThumb: boolean,
  isDesktop: boolean,
) {
  if (thumbShape === 'circle' && phase === 'collapsing-image') {
    return undefined
  }

  if (collapsingThumb) return 'rounded-[10px]'

  return isDesktop ? 'rounded-[25px]' : 'rounded-[15px]'
}

function getMotionBorderRadius(thumbShape: ThumbShape, phase: Phase) {
  if (thumbShape === 'circle' && phase === 'collapsing-image') {
    return '50%'
  }

  return undefined
}

function DesktopTextBody({
  categoryName,
  tags,
  description,
  ingredients,
  price,
}: {
  categoryName?: string
  tags: string[]
  description: string
  ingredients: string
  price: string
}) {
  return (
    <div className="flex flex-col gap-2.5 px-[19px] py-3">
      <DialogTagRow
        categoryName={categoryName}
        tags={tags}
        gapClassName="gap-2"
      />
      <p className="text-base leading-[25px] wrap-break-word text-black">
        {description}
      </p>
      <div className="flex items-start justify-between gap-4">
        <p className="min-w-0 flex-1 wrap-break-word rounded-[10px] bg-[#E0E0E0] px-3.5 py-2 text-[12px] leading-5 text-black">
          {ingredients}
        </p>
        <p className="shrink-0 text-2xl font-bold text-black lg:text-[32px]">
          {price}
        </p>
      </div>
    </div>
  )
}

export type ExpandableProductDialogProps = {
  src: string
  alt: string
  title: string
  productId?: string
  categoryName?: string
  description: string
  tags: string[]
  price: string
  ingredients: string
  desktopOnly?: boolean
  triggerClassName?: string
  onOpenChange?: (open: boolean) => void
  closeMotion?: CloseMotion
  thumbShape?: ThumbShape
  thumbPreview?: ReactNode
  children: ReactNode
}

export function ExpandableProductDialog({
  src,
  alt,
  title,
  productId,
  categoryName,
  description,
  tags,
  price,
  ingredients,
  desktopOnly = false,
  triggerClassName,
  onOpenChange,
  closeMotion = 'intro',
  thumbShape = 'rect',
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

  const addToCart = useCartStore((state) => state.addItem)
  const cartStep = useCartStore((state) => state.step)
  const qtyInCart = useCartStore(
    (state) =>
      state.lines.find((line) => line.productId === productId)?.qty ?? 0,
  )

  phaseRef.current = phase
  const isOpen = phase !== 'closed'
  const layout = typeof window === 'undefined' ? null : getExpandLayout()
  const viewportLayout = layout
    ? getViewportFittedLayout(layout, phase === 'open')
    : null
  if (viewportLayout) {
    imageHeightRef.current = viewportLayout.imageHeight
  } else if (layout) {
    imageHeightRef.current = layout.imageHeight
  }

  const dismissRef = useRef<() => void>(() => {})
  const closer = useCallback(() => {
    dismissRef.current()
  }, [])

  const closeNow = useCallback(() => {
    if (phaseRef.current === 'closed') return
    phaseRef.current = 'closed'
    removeExpandCloser(closer)
    setPhase('closed')
    onOpenChange?.(false)
  }, [closer, onOpenChange])

  const open = useCallback(() => {
    if (desktopOnly && !matchesMin(768)) return
    const el = thumbRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setOrigin({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
    addExpandCloser(closer)
    setPhase('expanding')
    onOpenChange?.(true)
  }, [closer, desktopOnly, onOpenChange])

  const dismiss = useCallback(() => {
    const current = phaseRef.current
    if (current === 'closed') return
    if (current === 'open') {
      setPhase('collapsing-text')
      return
    }
    if (current === 'expanding') {
      setPhase('collapsing-image')
    }
  }, [])
  dismissRef.current = dismiss

  useEffect(() => () => removeExpandCloser(closer), [closer])

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const syncLayout = () => setLayoutTick((tick) => tick + 1)
    window.addEventListener('resize', syncLayout)

    return () => {
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

      if (current === 'expanding' && isSameHeight(height, imageHeight)) {
        setPhase('open')
      } else if (
        current === 'collapsing-image' &&
        isSameHeight(height, origin?.height)
      ) {
        closeNow()
      }
    },
    [closeNow, origin],
  )

  const handleTextAnimEnd = useCallback(() => {
    if (phaseRef.current === 'collapsing-text') {
      setPhase('collapsing-image')
    }
  }, [])

  const isClosing = phase === 'collapsing-text' || phase === 'collapsing-image'

  // 差分ゼロなどで onAnimationComplete が発火しない場合の保険。
  // closed に戻せないと透明なオーバーレイが操作を奪い続ける
  useEffect(() => {
    if (!isClosing) return

    const duration =
      phase === 'collapsing-text' ? CLOSE_TEXT_DUR : CLOSE_IMAGE_DUR
    const nextPhase = phase === 'collapsing-text' ? 'collapsing-image' : 'closed'
    const timer = window.setTimeout(() => {
      if (nextPhase === 'closed') closeNow()
      else setPhase(nextPhase)
    }, duration * 1000 + 150)

    return () => window.clearTimeout(timer)
  }, [closeNow, isClosing, phase])

  const collapsingThumb =
    closeMotion === 'thumb-crossfade' && phase === 'collapsing-image'
  const imageFillsCard =
    phase === 'expanding' ||
    (phase === 'collapsing-image' && closeMotion === 'intro')
  const showExpandedText = phase === 'open'
  const cardHeightAuto = layout?.isDesktop && phase === 'open'
  const target =
    origin && layout ? getCardRect(phase, origin, layout) : null
  const motionTarget = target
    ? cardHeightAuto
      ? {
          left: target.left,
          top: target.top,
          width: target.width,
          height: 'auto' as const,
        }
      : target
    : null
  const isCollapseText = phase === 'collapsing-text'
  const isCollapseImage = phase === 'collapsing-image'
  const textAnimDur = isCollapseText ? CLOSE_TEXT_DUR : TEXT_DURATION
  const imageAnimDur = isCollapseImage ? CLOSE_IMAGE_DUR : IMAGE_DURATION
  const cardDuration = isCollapseText
    ? CLOSE_TEXT_DUR
    : isCollapseImage
      ? CLOSE_IMAGE_DUR
      : phase === 'open'
        ? TEXT_DURATION
        : IMAGE_DURATION
  const isDesktop = layout?.isDesktop ?? true
  const imageHeight =
    viewportLayout?.imageHeight ?? layout?.imageHeight ?? DESKTOP_IMAGE_HEIGHT
  const textHeight =
    viewportLayout?.textHeight ?? layout?.textHeight ?? MOBILE_TEXT_HEIGHT
  const canAddToCart =
    Boolean(productId) && cartStep === 'cart' && qtyInCart < MAX_QTY
  const cardRadiusClass = getCardRadiusClass(
    thumbShape,
    phase,
    collapsingThumb,
    isDesktop,
  )
  const motionBorderRadius = getMotionBorderRadius(thumbShape, phase)
  const motionAnimate =
    motionTarget && motionBorderRadius !== undefined
      ? { ...motionTarget, borderRadius: motionBorderRadius }
      : motionTarget

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
            ? 'max-md:pointer-events-none md:cursor-pointer'
            : 'cursor-pointer',
          isOpen ? 'invisible' : 'group',
          triggerClassName,
        )}
      >
        {children}
      </button>

      {isOpen && origin && motionAnimate
        ? createPortal(
            <div
              className={cn(
                'fixed inset-0 z-60 cursor-pointer',
                isClosing && 'pointer-events-none',
              )}
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
                transition={{ duration: imageAnimDur, ease: EASE }}
              />
              <motion.div
                className={cn(
                  'absolute overflow-hidden shadow-2xl',
                  cardHeightAuto &&
                    'hide-scrollbar overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
                  cardRadiusClass,
                )}
                initial={origin}
                animate={motionAnimate}
                style={
                  cardHeightAuto && viewportLayout
                    ? { maxHeight: viewportLayout.maxHeight }
                    : undefined
                }
                transition={{ duration: cardDuration, ease: EASE }}
                onAnimationComplete={handleCardAnimationComplete}
              >
                <div className={cn('relative w-full', !cardHeightAuto && 'size-full')}>
                  <motion.div
                    className={cn(
                      collapsingThumb
                        ? 'absolute inset-0 overflow-hidden'
                        : cn('flex flex-col', !cardHeightAuto && 'h-full'),
                    )}
                    animate={{ opacity: collapsingThumb ? 0 : 1 }}
                    transition={{ duration: imageAnimDur, ease: EASE }}
                  >
                <div
                  className="relative w-full shrink-0"
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
                        isDesktop ? `${layout?.width ?? DESKTOP_WIDTH}px` : '100vw'
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
                      disabled={!canAddToCart}
                      title={
                        qtyInCart >= MAX_QTY
                          ? `カートは${MAX_QTY}個までです`
                          : undefined
                      }
                      className={cn(
                        'flex shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-[#E4007E] text-[14px] font-bold text-white',
                        isDesktop
                          ? 'h-[45px] w-[155px]'
                          : 'h-[45px] w-[146px]',
                        canAddToCart ? 'cursor-pointer' : 'opacity-60',
                      )}
                      onClick={(event) => {
                        event.stopPropagation()
                        if (!productId || !canAddToCart) return
                        addToCart(productId, isDeliveryProductId(productId, tags))
                        dismiss()
                      }}
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
                {isDesktop ? (
                  <motion.div
                    className="overflow-hidden bg-white"
                    initial={false}
                    animate={{ height: showExpandedText ? 'auto' : 0 }}
                    transition={{ duration: textAnimDur, ease: EASE }}
                    onAnimationComplete={handleTextAnimEnd}
                  >
                    <DesktopTextBody
                      categoryName={categoryName}
                      tags={tags}
                      description={description}
                      ingredients={ingredients}
                      price={price}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    className="overflow-hidden bg-white"
                    initial={{ height: 0 }}
                    animate={{
                      height: showExpandedText ? textHeight : 0,
                    }}
                    transition={{ duration: textAnimDur, ease: EASE }}
                  >
                    <div
                      className="flex flex-col justify-between px-3 py-2.5"
                      style={{ height: textHeight }}
                    >
                      <DialogTagRow
                        categoryName={categoryName}
                        tags={tags}
                        gapClassName="gap-1.5"
                      />
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
                  </motion.div>
                )}
                  </motion.div>
                  {collapsingThumb && thumbPreview ? (
                    <motion.div
                      className="pointer-events-none absolute inset-0 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: imageAnimDur, ease: EASE }}
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
