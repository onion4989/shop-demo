// app/(main)/catalog/[productId]/page.tsx
import ProductDetailInfo from "@features/catalog/components/ProductDetailInfo";
import NutritionalTable from "@features/catalog/components/ProductNutritional";

export default async function Page({
  params,
}: {
  params: { productId: string };
}) {
  return (
    <main className="w-full lg:w-[1200px] m-auto">
      <section className="my-24">
        <ProductDetailInfo productId={params.productId} />

        <div className="my-20">
          <h3 className="font-bold pb-3">栄養成分表（1個当たり）</h3>
          <NutritionalTable productId={params.productId} />
        </div>
      </section>
    </main>
  );
}
