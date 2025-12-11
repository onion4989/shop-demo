// features/catalog/components/ProductItems.tsx
import { ExternalLink } from "@/components/ui/external-link";
import { getTopProducts } from "@features/catalog/Loaders";
import { ProductsCarousel } from "./ProductsCarousel";

export default async function ProductsItems() {
  // 最大 10 件取得
  const products = await getTopProducts(10);

  if (!products.length) {
    return (
      <div className="text-center font-bold my-24">
        <p>登録された商品がありません。</p>
        <p>管理画面から商品を登録してください。</p>
        <ExternalLink
          href="http://localhost:3000/auth/register"
          className="text-center my-10"
        >
          管理画面
        </ExternalLink>
      </div>
    );
  }

  return (
    <>
      {/* === タイトル === */}
      <h2
        className="
          text-5xl font-black tracking-wider
          text-[#E4007E] 
          drop-shadow whitespace-nowrap
        "
      >
        人気ランキング
      </h2>

      <section
        className="
          w-full max-w-[1200px] mx-auto my-24
          px-4
        "
      >
        <ProductsCarousel products={products} />
      </section>
    </>
  );
}
