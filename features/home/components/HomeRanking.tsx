import ProductsItems from '@features/catalog/components/ProductItems'
import { RankingSkeleton } from '@features/home/components/RankingSkeleton'
import { Suspense } from 'react'

export function HomeRanking() {
  return (
    <section className="mx-auto mt-36 w-full max-w-[1200px]">
      <Suspense fallback={<RankingSkeleton />}>
        <ProductsItems />
      </Suspense>
    </section>
  )
}
