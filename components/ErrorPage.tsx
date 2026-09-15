import Image from 'next/image'
import Link from 'next/link'
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['700', '900'],
})

const ICON_DIR = '/assets/pages/error/icons'

export function ErrorPage() {
  return (
    <main
      className={`${notoSansJp.className} flex min-h-dvh w-full items-center justify-center bg-gradient-to-b from-[#000000] to-[#4E4E4E] px-6`}
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="flex flex-col items-center">
          <span className="text-[clamp(64px,14vw,128px)] font-black leading-none tracking-[0.2em] text-white">
            500
          </span>
          <span className="relative mt-1 block pb-[clamp(60px,12vw,95px)]">
            <span className="relative z-0 text-[clamp(40px,10vw,96px)] font-black leading-none tracking-[0.2em] text-white">
              Error
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute left-[40%] top-[35%] z-10 block aspect-[175/125] w-[clamp(100px,18vw,175px)]"
            >
              <Image
                src={`${ICON_DIR}/img_error_ghost.png`}
                alt=""
                width={240}
                height={250}
                className="absolute left-0 top-0 h-full w-[68.6%] object-contain"
                priority
              />
            </span>
          </span>
        </h1>

        <p className="mt-2 text-[clamp(16px,2.5vw,24px)] font-bold leading-normal tracking-[0.2em] text-white md:mt-4">
          何かしらの問題が発生しました。
          <br />
          下記ボタンからお戻りください。
        </p>

        <Link
          href="/"
          prefetch={false}
          className="mt-8 inline-flex h-[60px] w-[min(280px,100%)] items-center justify-center rounded-[10px] bg-[#E4007E] text-[clamp(16px,2.5vw,24px)] font-bold tracking-[0.2em] text-white transition-opacity hover:opacity-90 md:mt-10"
        >
          Topへ戻る
        </Link>
      </div>
    </main>
  )
}
