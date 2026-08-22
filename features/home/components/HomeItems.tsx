import Image from 'next/image'

type Item = {
  file: string
  label: string
  limited?: boolean
}

type ItemGroup = {
  title: string
  folder: string
  tone: string
  wide?: boolean
  items: Item[]
}

const ITEMS_DIR = '/assets/pages/top/items'

const GROUPS: ItemGroup[] = [
  {
    title: 'カップケーキ / Cup Cake',
    folder: 'cupcake',
    tone: 'bg-[#94D0BF]',
    wide: true,
    items: [
      { file: 'Armond_img.jpg', label: 'アーモンドクリーム', limited: true },
      { file: 'Heartvanilla_img.jpg', label: 'ハートバニラ', limited: true },
      { file: 'HeartTip_img.jpg', label: 'ハートチップ' },
      { file: 'CreamCup_img.jpg', label: 'クリームカップ' },
      { file: 'HearbMint_img.jpg', label: 'ハーブミント' },
      { file: 'Blosam_img.jpg', label: 'ブロッサム' },
      { file: 'ChocoTip_img.jpg', label: 'チョコチップ' },
      { file: 'ChearryVanillra_img.jpg', label: 'チェリーバニラ' },
    ],
  },
  {
    title: 'アイスケーキ / Ice Cake',
    folder: 'ice-cake',
    tone: 'bg-[#FBC4C0]',
    items: [
      { file: 'Miracle_img.jpg', label: 'ミラクルアイス', limited: true },
      { file: 'Derax_img.jpg', label: 'デラックスアイス', limited: true },
    ],
  },
  {
    title: 'トッピング / Options',
    folder: 'options',
    tone: 'bg-[#E4C1DB]',
    items: [
      { file: 'Topping_img.jpg', label: 'トッピングシュガー' },
      { file: 'Sugaer_img.jpg', label: 'シュガースプレー' },
      { file: 'ChocoSpray_img.jpg', label: 'チョコスプレー' },
    ],
  },
  {
    title: 'タルトケーキ / Tart Cake',
    folder: 'tart-cake',
    tone: 'bg-[#D2B48CB4]',
    wide: true,
    items: [
      { file: 'Orange-Lemon_img.jpg', label: 'ミカン＆レモン' },
      { file: 'FrutsMix_img.jpg', label: 'フルーツミックス' },
      { file: 'Str-Hunney_img.jpg', label: '木イチゴ＆ハチミツ', limited: true },
    ],
  },
]

function ItemCard({ folder, item }: { folder: string; item: Item }) {
  return (
    <div className="flex w-40 flex-col items-center gap-3 md:w-[100px] lg:w-40">
      <div className="relative size-40 md:size-[100px] lg:size-40">
        <div className="relative size-40 overflow-hidden rounded-full border-2 border-white md:size-[100px] lg:size-40">
          <Image
            src={`${ITEMS_DIR}/${folder}/${item.file}`}
            alt={item.label}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 160px, (min-width: 768px) 100px, 160px"
          />
        </div>
        {item.limited ? (
          <span className="absolute top-2 right-0 z-10 rounded-full bg-[#E4007E] px-2 py-0.5 text-xs font-bold text-white md:text-[10px] lg:text-xs">
            期間限定
          </span>
        ) : null}
      </div>
      <p className="text-center text-sm font-bold text-[#070707] md:text-xs lg:text-sm">
        {item.label}
      </p>
    </div>
  )
}

function ItemCategory({ group }: { group: ItemGroup }) {
  return (
    <section className={group.wide ? 'lg:col-span-2' : undefined}>
      <h2 className="mb-3 text-[32px] font-bold text-[#E4007E] md:text-[20px] lg:text-[32px]">
        {group.title}
      </h2>
      <div
        className={`flex flex-wrap gap-x-6 gap-y-8 rounded-[25px] px-7 py-8 ${group.tone}`}
      >
        {group.items.map((item) => (
          <ItemCard key={item.file} folder={group.folder} item={item} />
        ))}
      </div>
    </section>
  )
}

export function HomeItems() {
  const [cupcake, ice, options, tart] = GROUPS

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-24 lg:px-0">
      <div className="flex flex-col gap-12">
        <ItemCategory group={cupcake} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ItemCategory group={ice} />
          <ItemCategory group={options} />
        </div>
        <ItemCategory group={tart} />
      </div>
    </section>
  )
}
