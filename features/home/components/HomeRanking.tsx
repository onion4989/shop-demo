import ProductsItems from '@features/catalog/components/ProductItems'
import { RankingSkeleton } from '@features/home/components/RankingSkeleton'
import { Suspense } from 'react'

export function HomeRanking() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 md:mt-24 md:px-0 lg:mt-32">
      <Suspense fallback={<RankingSkeleton />}>
        <ProductsItems />
      </Suspense>
    </section>
  )
}
