import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HERO_CARD_PATTERN = /^img_top_hero-card_\d+\.(jpg|jpeg|png|webp|avif)$/i
const HERO_ITEM_PATTERN = /^img_top_hero-round_\d+\.(jpg|jpeg|png|webp|avif)$/i

export function resolveAssetPath(assetPath: string | null | undefined) {
  if (!assetPath) return ""

  const normalized = assetPath.trim().replace(/^\/+/, "").replace(/^assets\//, "")
  if (!normalized) return ""

  if (normalized.includes("/")) {
    return `/assets/${normalized}`
  }

  if (HERO_CARD_PATTERN.test(normalized)) {
    return `/assets/pages/top/hero/cards/${normalized}`
  }

  if (HERO_ITEM_PATTERN.test(normalized)) {
    return `/assets/pages/top/hero/items/${normalized}`
  }

  return `/assets/common/items/${normalized}`
}
