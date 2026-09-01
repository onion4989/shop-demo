import { getTopProducts } from '@features/catalog/Loaders'
import { MobileRankingList } from './MobileRankingList'
import { ProductsCarousel } from './ProductsCarousel'

export default async function ProductsItems() {
  const products = await getTopProducts(10)

  if (!products.length) {
    return (
      <div className="my-24 text-center font-bold">
        <p>登録された商品がありません。</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[708px] px-4 md:px-0 lg:max-w-none">
      <h2 className="pb-[20px] text-[16px] font-bold tracking-wider text-[#E4007E] md:text-[24px] lg:text-[36px]">
        人気ランキング / Ranking
      </h2>
      <div className="mb-0 md:mb-24 lg:mb-32">
        <MobileRankingList products={products} />
        <div className="hidden md:block">
          <ProductsCarousel products={products} />
        </div>
      </div>
    </div>
  )
}
