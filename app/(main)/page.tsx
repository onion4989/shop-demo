// app/(main)/page.tsx

export const revalidate = 300;

import { Suspense } from "react";
import { ProductsSkeleton } from "@features/ui/skeletons";
import ProductsItems from "@features/catalog/components/ProductItems";
import Hero from "@/components/hero/Hero";
import Banner from "@components/banner/Banner";
import WaveSvg from "@components/hero/Wave";

export default function Home() {
  return (
    <main className="w-full m-auto">

      <section className="bg-[#F4B2BA]">
        <div className="h-[900px] p-16">
          <Hero />
        </div>
      </section>

      <section className="w-full wave-section">
        <WaveSvg />
      </section>

      <section className="w-full lg:w-[1200px] mt-36 m-auto">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsItems />
        </Suspense>
      </section>

      <section
        className="
          w-full
          bg-[#FBC4C0]
          py-16 sm:py-20 lg:py-24
          flex justify-center items-center
          mb-24
        "
      >
        <Banner />
      </section>

      {/* ▼ 予備セクション（空） */}
      <section className="w-full lg:w-[1200px] m-auto">
        {/* 今後のコンテンツ */}
      </section>
    </main>
  );
}
