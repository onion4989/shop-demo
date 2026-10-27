export type Item = {
  file: string
  label: string
  limited?: boolean
  productId?: string
}

export type ItemGroup = {
  title: string
  folder: string
  tone: string
  wide?: boolean
  comingSoon?: boolean
  items: Item[]
}

export const HOME_ITEM_GROUPS: ItemGroup[] = [
  {
    title: 'カップケーキ / Cup Cake',
    folder: 'cupcake',
    tone: 'bg-[#94D0BF]',
    wide: true,
    items: [
      { file: 'img_cup_CUP00001.jpg', label: 'チョコチップ', productId: 'CUP00001' },
      {
        file: 'img_cup_CUP00002.jpg',
        label: 'ハートチップ',
        limited: true,
        productId: 'CUP00002',
      },
      { file: 'img_cup_CUP00003.jpg', label: 'クリーム', productId: 'CUP00003' },
      { file: 'img_cup_CUP00004.jpg', label: 'ハーブミント', productId: 'CUP00004' },
      { file: 'img_cup_CUP00005.jpg', label: 'さくら', productId: 'CUP00005' },
      {
        file: 'img_cup_CUP00006.jpg',
        label: 'アーモンド',
        limited: true,
        productId: 'CUP00006',
      },
      { file: 'img_cup_CUP00007.jpg', label: 'ミルクバニラ', productId: 'CUP00007' },
      { file: 'img_cup_CUP00008.jpg', label: 'チェリーバニラ', productId: 'CUP00008' },
    ],
  },
  {
    title: 'アイスケーキ / Ice Cake',
    folder: 'ice-cake',
    tone: 'bg-[#FBC4C0]',
    items: [
      {
        file: 'img_ice_ICE00001.jpg',
        label: 'ミラクル',
        limited: true,
        productId: 'ICE00001',
      },
      {
        file: 'img_ice_ICE00002.jpg',
        label: 'デラックス',
        limited: true,
        productId: 'ICE00002',
      },
    ],
  },
  {
    title: 'トッピング / Options',
    folder: 'options',
    tone: 'bg-[#E4C1DB]',
    comingSoon: true,
    items: [
      { file: 'img_opt_topping.jpg', label: 'トッピングシュガー' },
      { file: 'img_opt_sugar.jpg', label: 'シュガースプレー' },
      { file: 'img_opt_choco-spray.jpg', label: 'チョコスプレー' },
    ],
  },
  {
    title: 'タルトケーキ / Tart Cake',
    folder: 'tart-cake',
    tone: 'bg-[#D2B48CB4]',
    wide: true,
    items: [
      { file: 'img_tart_TAR00001.jpg', label: 'ミカン＆レモン', productId: 'TAR00001' },
      { file: 'img_tart_TAR00002.jpg', label: 'フルーツミックス', productId: 'TAR00002' },
      {
        file: 'img_tart_TAR00003.jpg',
        label: '木イチゴ＆ハチミツ',
        limited: true,
        productId: 'TAR00003',
      },
    ],
  },
]

export const HOME_ITEMS_PRODUCT_IDS = HOME_ITEM_GROUPS.flatMap((group) =>
  group.items.flatMap((item) => (item.productId ? [item.productId] : [])),
)
