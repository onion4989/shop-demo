import { Hero } from '@features/home/components/Hero'
import { HomeCrucelTest } from '@features/home/components/HomeCrucelTest'
import { HomeGift } from '@features/home/components/HomeGift'
import { HomeItems } from '@features/home/components/HomeItems'

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
