import { HeroFanCards } from '@features/home/components/HeroFanCards'
import { HeroRoundItems } from '@features/home/components/HeroRoundItems'

export function Hero() {
  return (
    // モバイルは後で差し替え。md+ は 768px=600px → 1920px=900px
    <section className="relative -mt-[100px] flex h-[1000px] w-full flex-col overflow-hidden md:h-[clamp(600px,calc(26.0417vw+400px),900px)]">
      {/* 5. 背景：ピンク矩形 */}
      <div className="relative z-0 flex min-h-0 flex-1 flex-col bg-[#F4B2BA]">
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center px-4 pt-[100px] md:justify-center md:pt-[120px] lg:pt-[128px] xl:pt-[136px]">
          {/* カード + pill + アイテムの重ねブロック */}
          <div className="relative w-full max-w-[996px]">
            {/* 4. 扇カード（pill の後ろ） */}
            <div className="relative z-10 flex justify-center">
              <HeroFanCards />
            </div>

            {/* 3. pill / 2. アイテム / 1. タグ */}
            <div className="relative z-20 -mt-[100px] flex h-[130px] items-end justify-center md:-mt-20 md:h-[120px] lg:-mt-24 xl:-mt-[100px] xl:h-[130px]">
              {/* 3. 角丸レクタングル（アイテム中央より下に配置） */}
              <div
                className="absolute bottom-0 left-1/2 z-20 h-24 w-full max-w-[996px] -translate-x-1/2 rounded-full bg-[#FFFDED] md:h-20 md:max-w-[clamp(600px,calc(34.375vw+336px),996px)] lg:h-24"
                aria-hidden
              />

              {/* 2. 丸アイテム（pill 中央より上にはみ出す）+ 1. タグ */}
              <HeroRoundItems />
            </div>
          </div>

          <h1 className="relative z-10 mt-8 text-center text-4xl font-black tracking-wider text-black sm:text-6xl md:mt-5 md:text-[clamp(48px,calc(3.2986vw+22.667px),86px)] md:leading-none lg:mt-6 xl:mt-8">
            CAKE SHOP DEMO
          </h1>
        </div>
      </div>

      {/* 5. 背景：下部ウェーブ（section 高さに含む） */}
      <img
        src="/assets/pages/top/hero/decorations/Hero_UnderWave.svg"
        alt=""
        className="relative z-0 block w-full shrink-0"
      />
    </section>
  )
}
