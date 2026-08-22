import { HomeIntroExpandablePhoto } from '@features/home/components/HomeIntroExpandablePhoto'

const INTRO_PHOTOS = '/assets/pages/top/intro/photos'

const ITEM1_DESCRIPTION =
  'フルーツやチョコなど多彩な味わいが楽しめる特製タルトの詰め合わせ。サクサク生地と厳選素材が織りなす至福の美味しさです。大切な方へのギフトや、贅沢なティータイムにどうぞ。'

const HOLE_CAKE_DESCRIPTION =
  '真っ赤なジュレとフレッシュなイチゴを華やかに飾った特製フレジエ。断面に並ぶイチゴとまろやかなクリーム、底のクッキー生地が美しい層をなします。特別な日を上品に彩る、贅沢な味わいのホールケーキです。'

const GIFT_CAKE_DESCRIPTION =
  '豪華なギフトボックスでお届けするプレミアムアイスクリームケーキ。ベリーを飾った華やかな2段ケーキは、お誕生日や特別な記念日にぴったりです。ひんやり贅沢な味わいで、至福のひとときを贈ります。'

const MACARON_DESCRIPTION =
  'カラフルで愛らしい見た目が目を惹く極上マカロンの詰め合わせ。外はさっくり、中はしっとりとしたコックに濃厚なクリームを贅沢にサンドしました。ティータイムやギフトに華やかさと笑顔を添える逸品です。'

const CUPCAKE_DESCRIPTION =
  'ずらりと並んだ姿が可愛らしい、バラエティ豊かなミニカップケーキのセット。抹茶やベリー、チョコなど素材の味わいを生かした多彩なフレーバーを楽しめます。パーティーや贈り物、特別なティータイムにどうぞ。'

const FRUIT_TART_DESCRIPTION =
  'ギフトボックスに並ぶ、彩り豊かなフルーツタルト3種。オレンジやベリーなど旬の果実を、サクサクのタルト生地に贅沢に盛り付けました。小さなお祝いにも、自分へのご褒美にもぴったりの一箱です。'

const DUMMY_INGREDIENTS =
  '小麦粉、バター（またはマーガリン）、砂糖、卵、カスタードクリーム、アーモンドクリーム、生クリーム、チーズなど'

const bubbles = [
  { size: 40, className: 'top-[8%] left-[6%]' },
  { size: 64, className: 'top-[37px] right-[14px]' },
  { size: 108, className: 'top-[172px] right-[46px]' },
  { size: 28, className: 'top-[18%] left-[22%]' },
  { size: 80, className: 'top-[312px] left-[85px]' },
  { size: 52, className: 'top-[42%] right-[9%]' },
  { size: 140, className: 'top-[521px] left-[41px]' },
  { size: 96, className: 'top-[68%] right-[5%]' },
  { size: 36, className: 'top-[82%] left-[12%]' },
  { size: 72, className: 'top-[88%] right-[18%]' },
]

export function HomeIntro() {
  return (
    <section className="relative mb-[93px] bg-gradient-to-b from-[#FBDCC0] to-[#F4B2BA]">
      <div className="relative mx-auto min-h-[800px] w-full max-w-[1440px]">
        {bubbles.map((bubble) => (
          <span
            key={bubble.className}
            aria-hidden
            className={`pointer-events-none absolute rounded-full bg-white/40 ${bubble.className}`}
            style={{ width: bubble.size, height: bubble.size }}
          />
        ))}

        <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-4 pt-8 pb-8 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[280px_280px_128px] lg:px-0">
          <HomeIntroExpandablePhoto
            src={`${INTRO_PHOTOS}/Intro_Waffles.jpg`}
            alt="バラエティータルト"
            className="min-h-[280px] sm:col-span-2 lg:col-span-1 lg:row-span-3 lg:min-h-0"
            title="バラエティータルト 16種類"
            description={ITEM1_DESCRIPTION}
            tags={['クーポン可', '配送可', '贈答可']}
            price="￥5,600"
            ingredients={DUMMY_INGREDIENTS}
          />
          <HomeIntroExpandablePhoto
            src={`${INTRO_PHOTOS}/Intro_HoleCake.jpg`}
            alt="木イチゴの豪華ホールケーキ"
            className="min-h-[280px] lg:min-h-0"
            title="木イチゴの豪華ホールケーキ"
            description={HOLE_CAKE_DESCRIPTION}
            tags={['贈答可', '配送可', '予約制']}
            price="￥8,500"
            ingredients={DUMMY_INGREDIENTS}
          />
          <HomeIntroExpandablePhoto
            src={`${INTRO_PHOTOS}/Intro_Macalon.jpg`}
            alt="マカロン 8種"
            className="min-h-[200px] lg:h-[356px] lg:min-h-0 lg:self-start"
            title="マカロン 8種"
            description={MACARON_DESCRIPTION}
            tags={['贈答可', '配送可']}
            price="￥3,600"
            ingredients={DUMMY_INGREDIENTS}
          />
          <HomeIntroExpandablePhoto
            src={`${INTRO_PHOTOS}/Intro_HoleCake_Presents.jpg`}
            alt="プレミアムアイスクリームケーキ"
            className="min-h-[280px] lg:min-h-0"
            title="プレミアムアイスクリームケーキ"
            description={GIFT_CAKE_DESCRIPTION}
            tags={['贈答可', '配送可', '予約制']}
            price="￥9,200"
            ingredients={DUMMY_INGREDIENTS}
          />
          <HomeIntroExpandablePhoto
            src={`${INTRO_PHOTOS}/Intro_5CupCake.jpg`}
            alt="カップケーキ 5種類"
            className="min-h-[200px] lg:col-start-3 lg:row-start-3 lg:h-[356px] lg:min-h-0 lg:self-end"
            title="カップケーキ 5種類"
            description={CUPCAKE_DESCRIPTION}
            tags={['贈答可', '配送可']}
            price="￥2,650"
            ingredients={DUMMY_INGREDIENTS}
          />
          <HomeIntroExpandablePhoto
            src={`${INTRO_PHOTOS}/Intro_3Trut.jpg`}
            alt="フルーツタルト 3種類"
            className="min-h-[128px] lg:col-start-2 lg:row-start-3 lg:min-h-0"
            title="フルーツタルト 3種類"
            description={FRUIT_TART_DESCRIPTION}
            tags={['贈答可', '配送可']}
            price="￥980"
            ingredients={DUMMY_INGREDIENTS}
          />
        </div>

        <img
          src="/assets/pages/top/intro/decorations/bg_under_drops.svg"
          alt=""
          width={385}
          height={94}
          className="pointer-events-none absolute top-full left-1/2 z-10 w-[385px] max-w-[90%] -translate-x-1/2 -translate-y-px"
        />
      </div>
    </section>
  )
}
