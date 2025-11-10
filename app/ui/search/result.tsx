import ProductDesignCard from "@/app/components/card/card";
import { SearchProductsProps } from "@/app/lib/definitions";

export default function ResultsTable({ result }: { result: SearchProductsProps[] }) {
  return (
    <>
      {/* <p>検索数：{products.length}</p> */}
      <div className="grid gap-6 grid-cols-6">
        {result.length === 0 ? (
          <p>該当なし</p>
        ) : (
          result.map((item, id) => (
            <div key={item.category.name + "_" + id}>
              <ProductDesignCard
                id={id + 1}
                productid={item.productId}
                name={item.name}
                category={item.category.name}
                price={item.price}
                img={item.images[0].thumbnailUrl}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}
