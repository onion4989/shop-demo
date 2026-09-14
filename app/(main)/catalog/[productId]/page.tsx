// app/(main)/catalog/[productId]/page.tsx
import ProductDetailInfo from "@features/catalog/components/ProductDetailInfo";
import NutritionalTable from "@features/catalog/components/ProductNutritional";
import { getProductDetailCached } from "@features/catalog/Loaders";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProductDetailCached(productId);

  if (
    !product ||
    !product.images?.length ||
    !product.images[0]?.thumbnailUrl
  ) {
    notFound();
  }

  const nutri = product.nutritionalInfo[0] ?? null;

  return (
    <main className="w-full lg:w-[1200px] m-auto">
      <section className="my-24">
        <ProductDetailInfo product={product} />

        <div className="my-20">
          <h3 className="font-bold pb-3">栄養成分表（1個当たり）</h3>
          <NutritionalTable nutri={nutri} />
        </div>
      </section>
    </main>
  );
}
