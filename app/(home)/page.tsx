// app/(home)/page.tsx
export const revalidate = 300; // 5分ごと再生成（任意）

import { Suspense } from "react";
import { ProductsSkeleton } from "@/app/ui/skeletons";
import ProductsItems from "@/app/cards/product-items";
import Hero from "@/app/components/hero/hero";
import Banner from "@/app/components/banner/banner";

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
