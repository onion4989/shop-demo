import { Hero } from '@features/home/components/Hero'
import { HomeCrucelTest } from '@features/home/components/HomeCrucelTest'
import { HomeGift } from '@features/home/components/HomeGift'
import { HomeItems } from '@features/home/components/HomeItems'
import { siteDesc, siteName, siteOg } from '@lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  // 文字列だと template が付き「Sugar Alice｜Sugar Alice」になる
  title: { absolute: siteName },
  description: siteDesc,
  alternates: { canonical: '/' },
  openGraph: { ...siteOg, url: '/' },
}

export default function Home() {
  return (
    <main className="flex w-full flex-col gap-[var(--space-section)] pb-10 md:gap-[var(--space-section-md)] md:pb-0 lg:gap-[var(--space-section-lg)]">
      <Hero />
      <HomeCrucelTest />
      <HomeGift />
      <HomeItems />
    </main>
  )
}
