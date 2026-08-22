import { getTopProducts } from '@features/catalog/Loaders'
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
    <div className="mx-auto w-full max-w-[708px] lg:max-w-none">
      <h2 className="text-[36px] font-bold tracking-wider text-[#E4007E]">
        人気ランキング
      </h2>
      <div className="my-10">
        <ProductsCarousel products={products} />
      </div>
    </div>
  )
}
