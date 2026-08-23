export const revalidate = 300

import { Hero } from '@features/home/components/Hero'
import { HomeGift } from '@features/home/components/HomeGift'
import { HomeItems } from '@features/home/components/HomeItems'
import { HomeRanking } from '@features/home/components/HomeRanking'

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <HomeRanking />
      <HomeGift />
      <HomeItems />
    </main>
  )
}
