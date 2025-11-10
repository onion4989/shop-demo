import SearchFroms from "@/app/ui/search/forms";
import HitNumber from "@/app/ui/search/hit";
import ResultsTable from "@/app/ui/search/result";
import { Suspense } from "react";
import Spinner from "@/app/ui/spinner";

import { fetchFilteredProducts } from "@/app/lib/data";
//import { fetchAllProducts } from "@/app/lib/data";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category?: string;
    price?: string;
    options?: string;
  };
}) {
  const query = searchParams?.query || "";
  const category = searchParams?.category || "";
  const price = searchParams?.price || "";
  const options = searchParams?.options || "";

  //const max = await fetchAllProducts();
  const { products, total } = await fetchFilteredProducts(query, category, Number(price), options);
  console.log(products);

  return (
    <main className="w-[100%] lg:w-[1200px] m-auto">
      <section className="my-24">
        <div className="grid grid-cols-12 gap-6 my-24">
          <div className="col-span-10 grid grid-cols-4 gap-4">
            <SearchFroms />
          </div>
          <div className="col-span-2">
            <Suspense fallback={<Spinner />}>
              <HitNumber max={total} search={products.length} />
            </Suspense>
          </div>
        </div>
        <div>
          <Suspense fallback={<Spinner />}>
            <ResultsTable result={products} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
