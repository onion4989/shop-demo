import { Hero } from '@features/home/components/Hero'
import { HomeGift } from '@features/home/components/HomeGift'
import { HomeItems } from '@features/home/components/HomeItems'
import { HomeRanking } from '@features/home/components/HomeRanking'

export default function Home() {
  return (
    <main className="flex w-full flex-col gap-[var(--space-section)] pb-10 md:gap-[var(--space-section-md)] md:pb-0 lg:gap-[var(--space-section-lg)]">
      <Hero />
      <HomeRanking />
      <HomeGift />
      <HomeItems />
    </main>
  )
}
