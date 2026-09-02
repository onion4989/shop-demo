/** モバイル 2 列グリッドの DOM 順（Figma Mobile Top 準拠） */
export const HOME_GIFT_MOBILE_ORDER = [
  'GIF00006',
  'GIF00001',
  'GIF00004',
  'GIF00003',
  'GIF00002',
  'GIF00005',
] as const

const MOBILE_CLASS_BY_ID: Record<
  (typeof HOME_GIFT_MOBILE_ORDER)[number],
  string
> = {
  GIF00006: 'h-20 min-h-0',
  GIF00001: 'h-20 min-h-0',
  GIF00004: 'h-20 min-h-0',
  GIF00003: 'h-20 min-h-0',
  GIF00002: 'h-20 min-h-0',
  GIF00005: 'h-20 min-h-0',
}

export const HOME_GIFT_MOBILE_SLOTS = HOME_GIFT_MOBILE_ORDER.map(
  (productId) => ({
    productId,
    className: MOBILE_CLASS_BY_ID[productId],
  }),
)

/** デスクトップ / タブレット用（モバイル Top 実装前のレイアウト） */
export const HOME_GIFT_DESKTOP_SLOTS = [
  {
    productId: 'GIF00001',
    className:
      'min-h-[280px] md:h-[200px] md:min-h-[200px] sm:col-span-2 lg:col-span-1 lg:row-span-3 lg:h-auto lg:min-h-0',
  },
  {
    productId: 'GIF00002',
    className:
      'min-h-[280px] md:h-[200px] md:min-h-[200px] lg:h-auto lg:min-h-0',
  },
  {
    productId: 'GIF00003',
    className:
      'min-h-[200px] md:h-[200px] md:min-h-[200px] lg:h-[356px] lg:min-h-0 lg:self-start',
  },
  {
    productId: 'GIF00004',
    className:
      'min-h-[280px] md:h-[200px] md:min-h-[200px] lg:h-auto lg:min-h-0',
  },
  {
    productId: 'GIF00005',
    className:
      'min-h-[200px] md:h-[200px] md:min-h-[200px] lg:col-start-3 lg:row-start-3 lg:h-[356px] lg:min-h-0 lg:self-end',
  },
  {
    productId: 'GIF00006',
    className:
      'min-h-[128px] md:h-[200px] md:min-h-[200px] sm:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-3 lg:h-auto lg:min-h-0',
  },
] as const

/** Loaders 用（productId 一覧） */
export const HOME_GIFT_SLOTS = HOME_GIFT_DESKTOP_SLOTS
