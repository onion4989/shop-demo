export const revalidate = 300

import { Hero } from '@features/home/components/Hero'
import { HomeGift } from '@features/home/components/HomeGift'
import { HomeItems } from '@features/home/components/HomeItems'
import { HomeRanking } from '@features/home/components/HomeRanking'

export default function Home() {
  return (
    <main className="flex w-full flex-col pb-10 max-md:gap-10 md:pb-0">
      <Hero />
      <HomeRanking />
      <HomeGift />
      <HomeItems />
    </main>
  )
}
