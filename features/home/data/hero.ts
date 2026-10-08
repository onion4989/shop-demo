export type HeroFanCard = {
  id: number
  filename: string
  alt: string
  rotate: number
  offsetY: number
  zIndex: number
}

export const heroFanCards: HeroFanCard[] = [
  {
    id: 1,
    filename: 'img_top_hero-card_01.jpg',
    alt: '店舗外観',
    rotate: -16,
    offsetY: 20,
    zIndex: 10,
  },
  {
    id: 2,
    filename: 'img_top_hero-card_02.jpg',
    alt: 'アイスクリーム',
    rotate: 0,
    offsetY: 0,
    zIndex: 20,
  },
  {
    id: 3,
    filename: 'img_top_hero-card_03.jpg',
    alt: 'カップケーキ',
    rotate: 16,
    offsetY: 20,
    zIndex: 30,
  },
]

export const HERO_FAN_CARD_DURATION = 0.7
export const HERO_FAN_CARD_STAGGER = 0.2
export const HERO_ITEMS_START_DELAY =
  (heroFanCards.length - 1) * HERO_FAN_CARD_STAGGER +
  HERO_FAN_CARD_DURATION -
  0.2
export const HERO_ITEM_STAGGER = 0.12
export const HERO_ITEM_DURATION = 0.65
export const HERO_MOBILE_QUERY = '(max-width: 767px)'
export const HERO_MOBILE_LIMIT = 3

export function getHeroTextDelay(count: number) {
  const last = Math.max(count - 1, 0)
  return (
    HERO_ITEMS_START_DELAY + last * HERO_ITEM_STAGGER + HERO_ITEM_DURATION
  )
}

export function getHeroFanInitialX(index: number) {
  if (index === 0) return 80
  if (index === 2) return -80
  return 0
}

export type HeroBadge = {
  label: string
  color: string
}

/** デモ用。将来は管理画面のバッジ選択と DB 連動 */
export const heroRoundBadges: HeroBadge[] = [
  { label: 'New', color: '#FF0089' },
  { label: 'New', color: '#FF0089' },
  { label: '再販', color: '#2B56FF' },
  { label: '限定', color: '#FF2F00' },
  { label: '限定', color: '#FF2F00' },
]

/** DB 未取得時の丸画像（本番と同ファイル） */
export const heroRoundFallbacks = [
  {
    id: 'hero-round-01',
    filename: 'img_top_hero-round_01.jpg',
    alt: 'おすすめ商品 1',
  },
  {
    id: 'hero-round-02',
    filename: 'img_top_hero-round_02.jpg',
    alt: 'おすすめ商品 2',
  },
  {
    id: 'hero-round-03',
    filename: 'img_top_hero-round_03.jpg',
    alt: 'おすすめ商品 3',
  },
  {
    id: 'hero-round-04',
    filename: 'img_top_hero-round_04.jpg',
    alt: 'おすすめ商品 4',
  },
  {
    id: 'hero-round-05',
    filename: 'img_top_hero-round_05.jpg',
    alt: 'おすすめ商品 5',
  },
] as const

