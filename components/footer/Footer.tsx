import Image from 'next/image'
import Link from 'next/link'

const PHOTO_DIR = '/assets/pages/top/footer/photos'
const ICON_DIR = '/assets/pages/top/footer/icons'

const SNS_ICONS = [
  { file: 'Facebook_Icon.svg', label: 'Facebook' },
  { file: 'Instagram_Icon.svg', label: 'Instagram' },
  { file: 'Twitter_Icon.svg', label: 'Twitter' },
  { file: 'Tiktok_Icon.svg', label: 'TikTok' },
  { file: 'Line_Icon.svg', label: 'LINE' },
] as const

function StorePhoto({
  file,
  alt,
  className,
}: {
  file: string
  alt: string
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[10px] ${className ?? ''}`}
    >
      <Image
        src={`${PHOTO_DIR}/${file}`}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 384px"
        className="object-cover"
      />
    </div>
  )
}

function FooterHeading({ children }: { children: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold text-white">{children}</h3>
      <hr className="mt-2 border-white/80" />
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#373737] text-white">
      <div className="relative flex h-[280px] w-full items-center justify-center overflow-hidden md:h-[377px]">
        <Image
          src={`${PHOTO_DIR}/Footer_Head.png`}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <p className="relative z-10 px-4 text-center text-4xl font-black tracking-wider text-black sm:text-6xl md:text-[96px]">
          Sugar Alice
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-[578px_1fr] lg:gap-8 lg:px-0">
        <div>
          <div className="grid grid-cols-[1fr_130px_130px] grid-rows-[160px_149px_60px] gap-5">
            <StorePhoto file="Store_img1.jpg" alt="店舗外観1" className="row-span-2 h-full min-h-[330px]" />
            <StorePhoto file="Store_img2.jpg" alt="店舗外観2" className="col-span-2" />
            <StorePhoto file="Store_img3.jpg" alt="店舗外観3" />
            <StorePhoto file="Store_img4.jpg" alt="店舗外観4" />
            <div className="flex h-[60px] items-center justify-between rounded-[10px] bg-[#838383] px-2.5">
              {SNS_ICONS.map((icon) => (
                <Image
                  key={icon.file}
                  src={`${ICON_DIR}/${icon.file}`}
                  alt={icon.label}
                  width={34}
                  height={36}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-x-8">
          <nav>
            <FooterHeading>MENU</FooterHeading>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog">・商品一覧</Link>
              </li>
              <li>
                <Link href="/contact">・お問い合わせ</Link>
              </li>
            </ul>
          </nav>
          <nav>
            <FooterHeading>ご利用方法</FooterHeading>
            <ul className="space-y-2 text-sm">
              <li>・ご注文について</li>
              <li>・お支払いについて</li>
              <li>・ギフト・プレゼントについて</li>
              <li>・注文後の変更について</li>
            </ul>
          </nav>
          <div>
            <FooterHeading>人気 Top５</FooterHeading>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>タルトミカン＆レモン</li>
              <li>チェリーバニラカップケーキ</li>
              <li>チョコチップカップケーキ</li>
              <li>ミルクバニラケーキ</li>
              <li>さくらカップケーキ</li>
            </ol>
          </div>
          <nav>
            <FooterHeading>店舗情報</FooterHeading>
            <ul className="space-y-2 text-sm">
              <li>・店舗情報</li>
              <li>・アクセス</li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
