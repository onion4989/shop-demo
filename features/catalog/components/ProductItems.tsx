import { getTopProducts } from '@features/catalog/Loaders'
import { EmptyProductsMessage } from '@features/home/components/EmptyProductsMessage'
import { MobileRankingList } from './MobileRankingList'
import { ProductsCarousel } from './ProductsCarousel'

export default async function ProductsItems() {
  const products = await getTopProducts(10)

  if (!products.length) {
    return <EmptyProductsMessage />
  }

  return (
    <div className="mx-auto w-full max-w-[708px] md:px-0 lg:max-w-none">
      <h2 className="pb-[20px] text-[16px] font-bold tracking-wider text-[#E4007E] md:text-[24px] lg:text-[36px]">
        人気ランキング / Ranking
      </h2>
      <div>
        <MobileRankingList products={products} />
        <div className="hidden md:block">
          <ProductsCarousel products={products} />
        </div>
      </div>
    </div>
  )
}
