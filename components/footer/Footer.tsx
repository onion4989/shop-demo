import Image from 'next/image'

const PHOTO_DIR = '/assets/pages/top/footer/photos'
const ICON_DIR = '/assets/pages/top/footer/icons'

const STORE_PHOTOS = [
  { file: 'img_top_ftr-store_01.jpg', alt: '店舗外観1' },
  { file: 'img_top_ftr-store_02.jpg', alt: '店舗外観2' },
  { file: 'img_top_ftr-store_03.jpg', alt: '店舗外観3' },
  { file: 'img_top_ftr-store_04.jpg', alt: '店舗外観4' },
] as const

const SNS_ICONS = [
  { file: 'ic_c_sns-facebook.svg', label: 'Facebook' },
  { file: 'ic_c_sns-instagram.svg', label: 'Instagram' },
  { file: 'ic_c_sns-twitter.svg', label: 'Twitter' },
  { file: 'ic_c_sns-tiktok.svg', label: 'TikTok' },
  { file: 'ic_c_sns-line.svg', label: 'LINE' },
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
        sizes="(max-width: 768px) 170px, 384px"
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

function MobileStoreGallery() {
  return (
    <div className="px-2.5 pt-2.5 md:hidden">
      <div className="mx-auto grid w-full max-w-[350px] grid-cols-2 gap-2.5">
        {STORE_PHOTOS.map((photo) => (
          <StorePhoto
            key={photo.file}
            file={photo.file}
            alt={photo.alt}
            className="h-[136px] w-[170px] justify-self-center"
          />
        ))}
      </div>
      <div className="mx-auto mt-2.5 flex w-full max-w-[350px] items-center justify-between rounded-[10px] bg-white/80 px-4 py-3">
        {SNS_ICONS.map((icon) => (
          <Image
            key={icon.file}
            src={`${ICON_DIR}/${icon.file}`}
            alt={icon.label}
            width={34}
            height={36}
            className="shrink-0 brightness-0"
          />
        ))}
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#373737] text-white">
      <div className="relative flex h-[200px] max-h-[200px] w-full items-center justify-center overflow-hidden lg:h-[377px] lg:max-h-none">
        <Image
          src={`${PHOTO_DIR}/img_top_ftr-head.png`}
          alt=""
          fill
          className="object-cover object-center brightness-50"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 z-10 flex -translate-y-5 flex-col items-center justify-center gap-2.5 px-4 text-center">
          <p className="text-[40px] font-black leading-none tracking-wider text-white drop-shadow-md md:text-[64px] lg:text-[96px]">
            Sugar Alice
          </p>
          <p className="text-[16px] leading-none text-white drop-shadow-md md:text-[32px]">
            シュガー・アリス
          </p>
        </div>
      </div>

      <MobileStoreGallery />

      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-[578px_1fr] lg:gap-8 lg:px-0">
        <div className="hidden md:block">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[1fr_130px_130px] lg:grid-rows-[160px_149px_60px]">
            <div className="flex flex-col gap-5 lg:row-span-3">
              <StorePhoto
                file={STORE_PHOTOS[0].file}
                alt={STORE_PHOTOS[0].alt}
                className="mx-auto h-[300px] w-full max-w-[342px] md:mx-0 md:max-w-none lg:max-w-none lg:min-h-0 lg:flex-1"
              />
              <div className="hidden h-[60px] w-full shrink-0 items-center justify-start gap-5 rounded-[10px] bg-[#838383] px-5 md:flex lg:justify-between lg:px-2.5">
                {SNS_ICONS.map((icon) => (
                  <Image
                    key={icon.file}
                    src={`${ICON_DIR}/${icon.file}`}
                    alt={icon.label}
                    width={34}
                    height={36}
                    className="brightness-0"
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5 lg:contents">
              <StorePhoto
                file={STORE_PHOTOS[1].file}
                alt={STORE_PHOTOS[1].alt}
                className="mx-auto h-[146px] w-full max-w-[342px] md:mx-0 md:max-w-none lg:col-span-2 lg:h-auto lg:max-w-none"
              />
              <div className="mx-auto grid w-full max-w-[342px] grid-cols-2 gap-5 md:mx-0 md:max-w-none lg:contents">
                <StorePhoto
                  file={STORE_PHOTOS[2].file}
                  alt={STORE_PHOTOS[2].alt}
                  className="h-[134px] lg:h-auto"
                />
                <StorePhoto
                  file={STORE_PHOTOS[3].file}
                  alt={STORE_PHOTOS[3].alt}
                  className="h-[134px] lg:h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-x-8">
          <nav>
            <FooterHeading>MENU</FooterHeading>
            <ul className="space-y-2 text-sm">
              <li>・商品一覧</li>
              <li>・お問い合わせ</li>
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
