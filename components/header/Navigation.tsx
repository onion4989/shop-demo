import Link from 'next/link'

const navLinks = [
  { href: '/catalog', label: '商品一覧' },
  { href: '/contact', label: 'お問い合わせ' },
] as const

export default function Navigations() {
  return (
    // sticky + pt-10 で「画面上端から 40px」をスクロール中も維持
    <div className="pointer-events-none sticky top-0 z-50 w-full px-4 pt-10 md:px-6">
      <header
        className="pointer-events-auto mx-auto flex h-[60px] w-full max-w-[1200px] items-center justify-between rounded-[10px] border border-white/50 bg-white/55 px-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md md:px-8"
        role="banner"
      >
        <Link href="/" className="min-w-0 shrink">
          <span className="block truncate text-sm font-bold tracking-wide text-black md:text-base">
            Sugar Alice
          </span>
          <span className="block truncate text-[10px] leading-tight text-black/60 md:text-xs">
            シュガー・アリス
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex lg:gap-8"
          aria-label="グローバルナビ"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#2B56FF] transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
    </div>
  )
}
