import ProductDetailInfo from "@/app/components/detail/detail-info";
import NutritionalTable from "@/app/components/detail/nutritional";

type ProductID = {
  params: {
    productid: string;
  };
};

export default async function Page({ params }: ProductID) {
  return (
    <main className="w-[100%] lg:w-[1200px] m-auto">
      <section className="my-24">
        <ProductDetailInfo productid={params.productid} />

        <div className="my-20">
          <h3 className="font-bold pb-3">栄養成分表（1個当たり）</h3>
          <NutritionalTable productid={params.productid} />
        </div>
      </section>
    </main>
  );
}
