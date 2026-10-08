'use client'

import { ExpandableProductDialog } from '@features/home/components/ExpandableProductDialog'
import type { CrucelItem } from '@features/home/data/crucelTest'
import {
  approachTilt,
  clampTilt,
  dragTilt,
  glideTilt,
  wrapScroll,
} from '@features/home/lib/crucelMotion'
import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'

const CARD_WIDTH_PX = 282
const IMG_HEIGHT_PX = 176
const RANK_SRC = '/assets/pages/top/crucel/deco_top_crucel-rank.svg'
const AUTOPLAY_PX_S = 30
const MAX_TILT_DEG = 18
const TILT_STRENGTH = 1.6
const DRAG_SENSITIVITY = 1
const MOMENTUM_GAIN = 3
const MOMENTUM_FRICTION = 0.94
const TILT_LERP = 0.24
const CARD_PERSPECTIVE = 900
const TRACK_PERSPECTIVE = 1400
const TILT_PAD_PX = 48
const CLICK_SKIP_PX = 6

const COPIES = [0, 1, 2]

function CrucelFace({
  item,
  index,
  copy,
}: {
  item: CrucelItem
  index: number
  copy: number
}) {
  const live = copy === 1
  return (
    <article
      data-crucel-card
      data-copy={copy}
      aria-hidden={live ? undefined : true}
      className="relative h-[344px] w-[282px] shrink-0 overflow-hidden rounded-[25px] bg-[#D2B48CB4] shadow-[6px_8px_10px_rgba(80,50,20,0.1)]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative h-[176px] overflow-hidden rounded-tl-[25px] rounded-tr-[25px]">
        {item.src ? (
          <Image
            src={item.src}
            alt={live ? item.name : ''}
            width={CARD_WIDTH_PX}
            height={IMG_HEIGHT_PX}
            draggable={false}
            className="pointer-events-none h-[176px] w-[282px] object-cover"
          />
        ) : null}
      </div>
      <div className="pointer-events-none absolute top-0 left-0">
        <img src={RANK_SRC} alt="" width={53} height={48} />
        <span className="absolute top-[9px] left-[12px] text-[24px] leading-none font-bold text-white">
          {index + 1}
        </span>
      </div>
      <p className="mt-2 ml-[13px] text-[10px] leading-none font-semibold text-black">
        {item.kind}
      </p>
      <h3 className="mt-1.5 ml-[11px] text-[16px] leading-none font-bold text-black">
        {item.name}
      </h3>
      <div className="mx-[11px] mt-[13px] h-[100px] overflow-hidden rounded-[15px] bg-white/80 px-[13px] py-[10px]">
        <p className="line-clamp-4 text-[12px] leading-normal text-black">
          {item.text}
        </p>
      </div>
    </article>
  )
}

function subscribeReduce(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function readReduce() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useReduceMotion() {
  return useSyncExternalStore(subscribeReduce, readReduce, () => false)
}

type CrucelTiltTrackProps = {
  items: CrucelItem[]
}

export function CrucelTiltTrack({ items }: CrucelTiltTrackProps) {
  const reduce = useReduceMotion()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const loopRef = useRef(0)
  const posRef = useRef(0)
  const dragRef = useRef(false)
  const movedRef = useRef(false)
  const dialogRef = useRef(false)
  const pointerRef = useRef<number | null>(null)
  const originX = useRef(0)
  const originScroll = useRef(0)
  const lastX = useRef(0)
  const lastAt = useRef(0)
  const velRef = useRef(0)
  const tiltNow = useRef(0)
  const tiltGoal = useRef(0)
  const easeRef = useRef(0)
  const glideRef = useRef(0)

  const paintTilt = (angle: number) => {
    const root = scrollerRef.current
    if (!root) return
    const cards = root.querySelectorAll<HTMLElement>('[data-crucel-card]')
    const value = readReduce()
      ? 'none'
      : `perspective(${CARD_PERSPECTIVE}px) rotateY(${angle}deg)`
    cards.forEach((card) => {
      card.style.transform = value
    })
  }

  const setTilt = (angle: number) => {
    if (readReduce()) {
      tiltNow.current = 0
      tiltGoal.current = 0
      paintTilt(0)
      return
    }
    tiltGoal.current = clampTilt(angle, MAX_TILT_DEG)
    if (easeRef.current !== 0) return
    const ease = () => {
      const next = approachTilt(tiltNow.current, tiltGoal.current, TILT_LERP)
      tiltNow.current = next
      paintTilt(next)
      if (next === tiltGoal.current) {
        easeRef.current = 0
        return
      }
      easeRef.current = requestAnimationFrame(ease)
    }
    easeRef.current = requestAnimationFrame(ease)
  }

  const stopGlide = () => {
    if (glideRef.current === 0) return
    cancelAnimationFrame(glideRef.current)
    glideRef.current = 0
  }

  const placeScroll = useCallback((pos: number) => {
    const root = scrollerRef.current
    if (!root) return
    const next = wrapScroll(pos, loopRef.current)
    posRef.current = next
    root.scrollLeft = next
  }, [])

  const measureLoop = useCallback(() => {
    const root = scrollerRef.current
    if (!root) return
    const head = root.querySelector<HTMLElement>('[data-copy="0"]')
    const mid = root.querySelector<HTMLElement>('[data-copy="1"]')
    if (!head || !mid) return
    const loop = mid.offsetLeft - head.offsetLeft
    if (loop <= 0) return
    const prev = loopRef.current
    loopRef.current = loop
    if (prev <= 0) placeScroll(loop)
  }, [placeScroll])

  const onDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (readReduce()) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const root = scrollerRef.current
    if (!root) return
    stopGlide()
    dragRef.current = false
    pointerRef.current = event.pointerId
    originX.current = event.clientX
    originScroll.current = posRef.current
    lastX.current = event.clientX
    lastAt.current = performance.now()
    velRef.current = 0
    movedRef.current = false
  }

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerRef.current !== event.pointerId) return
    const root = scrollerRef.current
    if (!root) return
    const dx = event.clientX - originX.current
    if (!movedRef.current) {
      if (Math.abs(dx) <= CLICK_SKIP_PX) return
      movedRef.current = true
      dragRef.current = true
      try {
        root.setPointerCapture(event.pointerId)
      } catch {
        // 信頼されていないポインタではキャプチャできない
      }
    }
    if (!dragRef.current) return
    const fromX = dx * DRAG_SENSITIVITY
    placeScroll(originScroll.current - fromX)
    const now = performance.now()
    const dt = Math.max(1, now - lastAt.current)
    const step = (event.clientX - lastX.current) * DRAG_SENSITIVITY
    const speed = (step / dt) * 1000
    velRef.current = (-speed / 60) * MOMENTUM_GAIN
    setTilt(dragTilt(step, speed, TILT_STRENGTH))
    lastX.current = event.clientX
    lastAt.current = now
  }

  const onUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerRef.current !== event.pointerId) return
    const dragged = dragRef.current
    dragRef.current = false
    pointerRef.current = null
    if (!dragged) return
    try {
      scrollerRef.current?.releasePointerCapture(event.pointerId)
    } catch {
      // キャプチャしていないときは何もしない
    }
    let vel = velRef.current
    const glide = () => {
      const root = scrollerRef.current
      if (!root || dragRef.current) {
        glideRef.current = 0
        return
      }
      placeScroll(posRef.current + vel)
      vel *= MOMENTUM_FRICTION
      setTilt(glideTilt(vel, TILT_STRENGTH))
      if (Math.abs(vel) < 0.15) {
        setTilt(0)
        glideRef.current = 0
        return
      }
      glideRef.current = requestAnimationFrame(glide)
    }
    glideRef.current = requestAnimationFrame(glide)
  }

  useLayoutEffect(() => {
    measureLoop()
  }, [items, measureLoop])

  useEffect(() => {
    // 連続スクロールはフレーム購読が必要。画面外・非表示タブ・ホバーでは進まない。
    // ポインタを離した通知が要素に届かないとき、ドラッグ停止が残らないようにする。
    const clearDrag = () => {
      dragRef.current = false
      pointerRef.current = null
    }
    const endDrag = (event: PointerEvent) => {
      const root = scrollerRef.current
      if (event.target instanceof Node && root?.contains(event.target)) return
      clearDrag()
    }
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    window.addEventListener('blur', clearDrag)

    let alive = true
    let frame = 0
    let last = performance.now()
    const tick = () => {
      if (!alive) return
      const node = scrollerRef.current
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (loopRef.current <= 0) measureLoop()
      if (readReduce() && (tiltNow.current !== 0 || tiltGoal.current !== 0)) {
        if (easeRef.current) cancelAnimationFrame(easeRef.current)
        easeRef.current = 0
        tiltNow.current = 0
        tiltGoal.current = 0
        paintTilt(0)
      }
      let onScreen = false
      if (node) {
        const rect = node.getBoundingClientRect()
        onScreen = rect.bottom > 0 && rect.top < window.innerHeight
      }
      const paused =
        readReduce() ||
        (node?.matches(':hover') ?? false) ||
        dragRef.current ||
        !onScreen ||
        document.hidden ||
        glideRef.current !== 0 ||
        dialogRef.current ||
        loopRef.current <= 0
      if (node && !paused) placeScroll(posRef.current + AUTOPLAY_PX_S * dt)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      if (easeRef.current) cancelAnimationFrame(easeRef.current)
      if (glideRef.current) cancelAnimationFrame(glideRef.current)
      easeRef.current = 0
      glideRef.current = 0
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      window.removeEventListener('blur', clearDrag)
    }
  }, [measureLoop, placeScroll])

  // 代替確認用。合わなければ、下のコメントを戻す。
  // useEffect(() => {
  //   if (!reduce) return
  //   tiltNow.current = 0
  //   tiltGoal.current = 0
  //   paintTilt(0)
  // }, [reduce])

  const onDialog = (open: boolean) => {
    dialogRef.current = open
  }

  const onClickCap = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!movedRef.current) return
    event.preventDefault()
    event.stopPropagation()
    movedRef.current = false
  }

  return (
    <div
      ref={scrollerRef}
      className="relative flex w-full gap-[30px] overflow-x-auto [scrollbar-width:none]"
      style={{
        perspective: `${TRACK_PERSPECTIVE}px`,
        marginTop: -TILT_PAD_PX,
        paddingTop: TILT_PAD_PX,
        paddingBottom: TILT_PAD_PX,
        overflowAnchor: 'none',
        cursor: reduce ? 'auto' : 'grab',
        touchAction: 'pan-y',
      userSelect: 'none',
    }}
    onPointerDown={onDown}
    onPointerMove={onMove}
    onPointerUp={onUp}
    onPointerCancel={onUp}
    onClickCapture={onClickCap}
  >
        {COPIES.map((copy) =>
          items.map((item, index) => (
            <ExpandableProductDialog
              key={`${item.id}-${copy}`}
              src={item.src}
              alt={item.name}
              title={item.name}
              productId={item.id}
              categoryName={item.kind}
              description={item.text}
              tags={item.tags}
              price={item.price}
              ingredients={item.ingredients}
              desktopOnly
              titleBadgeTone="neutral"
              closeMotion="thumb-crossfade"
              triggerClassName="w-[282px] shrink-0"
              onOpenChange={onDialog}
              thumbPreview={<CrucelFace item={item} index={index} copy={copy} />}
            >
              <CrucelFace item={item} index={index} copy={copy} />
            </ExpandableProductDialog>
          )),
        )}
    </div>
  )
}
