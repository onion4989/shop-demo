// app/(home)/page.tsx
export const revalidate = 300; // 5分ごと再生成（任意）

import { Suspense } from "react";
import { ProductsSkeleton } from "@/ui/skeletons";
import ProductsItems from "@/cards/product-items";
import Hero from "@/components/hero/hero";
import Banner from "@/components/banner/banner";

export default function Home() {
  return (
    <main className="w-[100%] lg:w-[1200px] m-auto">
      <section className="my-24">
        <Hero />
      </section>

      <section className="mb-24">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsItems />
        </Suspense>
      </section>

      <section className="mb-24">
        <Banner />
      </section>
    </main>
  );
}
