/** モバイル 2 列グリッドの DOM 順（Figma Mobile Top 準拠） */
export const HOME_GIFT_MOBILE_ORDER = [
  'GIF00006',
  'GIF00001',
  'GIF00004',
  'GIF00003',
  'GIF00002',
  'GIF00005',
] as const

export const HOME_GIFT_SLOTS = [
  {
    productId: 'GIF00001',
    className:
      'h-20 min-h-0 md:min-h-[200px] md:h-[200px] sm:col-span-2 lg:col-span-1 lg:row-span-3 lg:h-auto lg:min-h-0',
  },
  {
    productId: 'GIF00002',
    className:
      'h-20 min-h-0 md:min-h-[200px] md:h-[200px] lg:h-auto lg:min-h-0',
  },
  {
    productId: 'GIF00003',
    className:
      'h-20 min-h-0 md:min-h-[200px] md:h-[200px] lg:h-[356px] lg:min-h-0 lg:self-start',
  },
  {
    productId: 'GIF00004',
    className:
      'h-20 min-h-0 md:min-h-[200px] md:h-[200px] lg:h-auto lg:min-h-0',
  },
  {
    productId: 'GIF00005',
    className:
      'h-20 min-h-0 md:min-h-[200px] md:h-[200px] lg:col-start-3 lg:row-start-3 lg:h-[356px] lg:min-h-0 lg:self-end',
  },
  {
    productId: 'GIF00006',
    className:
      'h-20 min-h-0 md:min-h-[200px] md:h-[200px] sm:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-3 lg:h-auto lg:min-h-0',
  },
] as const
