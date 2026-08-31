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

export function getHeroFanInitialX(index: number) {
  if (index === 0) return 80
  if (index === 2) return -80
  return 0
}

export type HeroBadge = {
  label: string
  color: string
}

export type HeroRoundImage = {
  id: number
  filename: string
  alt: string
  badge: HeroBadge
}

export const heroRoundImages: HeroRoundImage[] = [
  {
    id: 1,
    filename: 'img_top_hero-round_01.jpg',
    alt: '商品イメージ',
    badge: { label: 'New', color: '#FF0089' },
  },
  {
    id: 2,
    filename: 'img_top_hero-round_02.jpg',
    alt: '商品イメージ',
    badge: { label: 'New', color: '#FF0089' },
  },
  {
    id: 3,
    filename: 'img_top_hero-round_03.jpg',
    alt: '商品イメージ',
    badge: { label: '再販', color: '#2B56FF' },
  },
  {
    id: 4,
    filename: 'img_top_hero-round_04.jpg',
    alt: '商品イメージ',
    badge: { label: '限定', color: '#FF2F00' },
  },
  {
    id: 5,
    filename: 'img_top_hero-round_05.jpg',
    alt: '商品イメージ',
    badge: { label: '限定', color: '#FF2F00' },
  },
]
