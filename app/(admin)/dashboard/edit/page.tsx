import { fetchDashboardSearchProducts, fetchCategory, fetchOptions } from "@/app/lib/data";
import EditProductForm from "@/app/components/(dashboard)/edit/edit-forms";

export default async function EditProduct({
  searchParams,
}: {
  searchParams: {
    productid: string;
  };
}) {
  const productid = searchParams?.productid || "";
  //const product = await fetchDashboardSearchProducts(productid);
  const [product, category, option] = await Promise.all([
    fetchDashboardSearchProducts(productid),
    fetchCategory(),
    fetchOptions(productid),
  ]);

  return (
    <>
      <h1 className="text-3xl font-bold text-white my-8">商品編集</h1>
      <div className="flex flex-col gap-4 text-white">
        <EditProductForm product={product} category={category} option={option} />
      </div>
    </>
  );
}
