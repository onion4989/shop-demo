'use client'

import { CategoryTag } from '@features/catalog/components/CategoryTag'
import { MAX_QTY, isDeliveryProductId } from '@features/cart/pricing'
import { useCartStore } from '@features/cart/store'
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
const TEXT_FALLBACK = 200
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

function matchesMin(px: number) {
  return window.matchMedia(`(min-width: ${px}px)`).matches
}

function maxTextH(imageH: number) {
  return Math.max(0, window.innerHeight - imageH - SIDE_GUTTER * 2)
}

function resolveTextH(bodyH: number, imageH: number) {
  const cap = maxTextH(imageH)
  if (bodyH <= 0) return Math.min(TEXT_FALLBACK, cap)
  return Math.min(bodyH, cap)
}

function getExpandLayout(bodyH: number): ExpandLayout {
  if (matchesMin(1024)) {
    const textHeight = resolveTextH(bodyH, DESKTOP_IMAGE_HEIGHT)
    return {
      width: DESKTOP_WIDTH,
      imageHeight: DESKTOP_IMAGE_HEIGHT,
      textHeight,
      cardHeight: DESKTOP_IMAGE_HEIGHT + textHeight,
      isDesktop: true,
    }
  }

  if (matchesMin(768)) {
    const textHeight = resolveTextH(bodyH, TABLET_IMAGE_HEIGHT)
    return {
      width: TABLET_WIDTH,
      imageHeight: TABLET_IMAGE_HEIGHT,
      textHeight,
      cardHeight: TABLET_IMAGE_HEIGHT + textHeight,
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
  thumbPreview,
  children,
}: ExpandableProductDialogProps) {
  const titleId = useId()
  const thumbRef = useRef<HTMLButtonElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<Phase>('closed')
  const imageHeightRef = useRef(DESKTOP_IMAGE_HEIGHT)
  const [phase, setPhase] = useState<Phase>('closed')
  const [origin, setOrigin] = useState<Rect | null>(null)
  const [bodyH, setBodyH] = useState(0)
  const [, setLayoutTick] = useState(0)

  const addToCart = useCartStore((state) => state.addItem)
  const cartStep = useCartStore((state) => state.step)
  const qtyInCart = useCartStore(
    (state) =>
      state.lines.find((line) => line.productId === productId)?.qty ?? 0,
  )

  phaseRef.current = phase
  const isOpen = phase !== 'closed'
  const layout = typeof window === 'undefined' ? null : getExpandLayout(bodyH)
  if (layout) {
    imageHeightRef.current = layout.imageHeight
  }

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
    setPhase('expanding')
  }, [desktopOnly])

  const dismiss = useCallback(() => {
    const current = phaseRef.current
    if (current === 'closed') return
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

  // カートが開いたら拡大ダイアログは閉じる（カゴ優先）。
  // 閉じアニメーション中にカゴを開くと完了イベントが来ず、
  // 透明なオーバーレイが残るためアニメーションせず即座に閉じる
  useEffect(
    () =>
      useCartStore.subscribe((state, previous) => {
        if (state.isOpen && !previous.isOpen) setPhase('closed')
      }),
    [],
  )

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const syncLayout = () => setLayoutTick((tick) => tick + 1)
    window.addEventListener('resize', syncLayout)

    return () => {
      window.removeEventListener('resize', syncLayout)
    }
  }, [isOpen])

  // テキスト量に合わせてカード高さを同期する
  useEffect(() => {
    const el = bodyRef.current
    if (!el || !isOpen) return

    const apply = () => setBodyH(el.offsetHeight)
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(el)
    return () => observer.disconnect()
  }, [isOpen, description, ingredients, tags, price, categoryName])

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
        current === 'collapsing-text' &&
        isSameHeight(height, imageHeight)
      ) {
        setPhase('collapsing-image')
      } else if (
        current === 'collapsing-image' &&
        isSameHeight(height, origin?.height)
      ) {
        setPhase('closed')
      }
    },
    [origin],
  )

  const isClosing = phase === 'collapsing-text' || phase === 'collapsing-image'

  // 差分ゼロなどで onAnimationComplete が発火しない場合の保険。
  // closed に戻せないと透明なオーバーレイが操作を奪い続ける
  useEffect(() => {
    if (!isClosing) return

    const duration =
      phase === 'collapsing-text' ? TEXT_DURATION : IMAGE_DURATION
    const timer = window.setTimeout(
      () => setPhase('closed'),
      duration * 1000 + 150,
    )

    return () => window.clearTimeout(timer)
  }, [isClosing, phase])

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
  const textHeight = layout?.textHeight ?? TEXT_FALLBACK
  const textClipped = isDesktop && bodyH > textHeight
  const canAddToCart =
    Boolean(productId) && cartStep === 'cart' && qtyInCart < MAX_QTY

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

      {isOpen && origin && target
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
                <motion.div
                  className={cn(
                    'bg-white',
                    textClipped ? 'overflow-y-auto' : 'overflow-hidden',
                  )}
                  initial={{ height: 0 }}
                  animate={{
                    height: showExpandedText ? textHeight : 0,
                  }}
                  transition={{ duration: TEXT_DURATION, ease: EASE }}
                >
                  {isDesktop ? (
                    <div
                      ref={bodyRef}
                      className="flex flex-col gap-2.5 px-[19px] py-3"
                    >
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
                  ) : (
                    <div className="flex h-[210px] flex-col justify-between px-3 py-2.5">
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
