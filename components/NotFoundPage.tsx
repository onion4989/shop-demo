import Image from 'next/image'
import Link from 'next/link'
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['700', '900'],
})

const ICON_DIR = '/assets/pages/not-found/icons'

export function NotFoundPage() {
  return (
    <main
      className={`${notoSansJp.className} flex min-h-dvh w-full items-center justify-center bg-gradient-to-b from-[#FBC4C0] to-white px-6`}
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="flex flex-col items-center">
          <span className="text-[clamp(64px,14vw,128px)] font-black leading-none tracking-[0.2em] text-[#920683]">
            404
          </span>
          <span className="relative mt-1 block pb-[clamp(60px,12vw,95px)]">
            <span className="relative z-0 text-[clamp(40px,10vw,96px)] font-black leading-none tracking-[0.2em] text-[#920683]">
              Not Found
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute left-[40%] top-[35%] z-10 block aspect-[175/125] w-[clamp(100px,18vw,175px)]"
            >
              <Image
                src={`${ICON_DIR}/img_404_ghost.png`}
                alt=""
                width={240}
                height={250}
                className="absolute left-0 top-0 h-full w-[68.6%] object-contain"
                priority
              />
              <Image
                src={`${ICON_DIR}/ic_404_cake.svg`}
                alt=""
                width={70}
                height={64}
                className="absolute left-[48.6%] top-[44%] h-[51.2%] w-[40%] rotate-[19deg] object-contain"
                priority
              />
            </span>
          </span>
        </h1>

        <p className="mt-2 text-[clamp(16px,2.5vw,24px)] font-bold leading-normal tracking-[0.2em] text-black md:mt-4">
          お探しのページは見つかりませんでした。
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
