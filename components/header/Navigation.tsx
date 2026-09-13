import Link from 'next/link'

const navLabels = ['商品一覧', 'お問い合わせ'] as const

export default function Navigations() {
  return (
    <div className="pointer-events-none sticky top-0 z-50 w-full px-4 pt-4 md:px-6 md:pt-10">
      <header
        className="pointer-events-auto mx-auto flex h-10 w-full max-w-[1200px] items-center justify-between rounded-[10px] border border-white/50 bg-white/55 px-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md md:h-[60px] md:px-8"
        role="banner"
      >
        <Link href="/" className="min-w-0 shrink leading-none">
          <span className="block truncate text-[11px] font-bold leading-none tracking-wide text-black md:text-base">
            Sugar Alice
          </span>
          <span className="mt-0.5 block truncate text-[10px] leading-none text-black/60 md:mt-0 md:text-xs">
            シュガー・アリス
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex lg:gap-8"
          aria-label="グローバルナビ"
        >
          {navLabels.map((label) => (
            <span
              key={label}
              className="text-sm font-medium text-[#2B56FF]"
            >
              {label}
            </span>
          ))}
        </nav>
      </header>
    </div>
  )
}
