// app/(admin)/dashboard/edit/page.tsx
import { notFound } from "next/navigation";
import EditProductForm from "@features/admin/components/EditForm";


// ※ data.ts 側は、以下の ID ごとキャッシュ関数を用意してある想定：
//   - getDashboardProductCached(productId: string)
//   - fetchCategory()  …固定キーでキャッシュ（カテゴリは変化が少ない）
//   - getOptionsCached(productId: string)
import {
  getDashboardProductCached,
  getCategoriesCached,
  getOptionsCached,
} from "@features/catalog/Loaders";

// 管理画面は“いつでも最新”が理想ですが、すでに data.ts 側で
// 5分キャッシュの ID 別キーにしているため、ここでは dynamic 指定は不要。
// 更新後に最新へ即反映したい場合は、更新API側で revalidateTag を呼ぶのがベスト。
// export const dynamic = "force-dynamic"; // ←基本は不要

type Props = {
  searchParams?: { productid?: string };
};

export default async function EditProduct({ searchParams }: Props) {
  const productid = searchParams?.productid?.trim();
  if (!productid) notFound();

  // 並行取得：編集フォームに必要な最小データのみ
  const [product, category, option] = await Promise.all([
    getDashboardProductCached(productid),
    getCategoriesCached(),                 // 変化少ないのでキャッシュ
    getOptionsCached(productid),
  ]);

  if (!product) notFound();

  return (
    <>
      <h1 className="text-3xl font-bold text-white my-8">商品編集</h1>
      <div className="flex flex-col gap-4 text-white">
        <EditProductForm
          product={product}
          category={category}
          option={option ?? { giftAvailable: false, seasonal: false, bulkPurchase: false, frozenDelivery: false, couponAvailable: false, shippingAvailable: false, reservationRequired: false }}
        />
      </div>
    </>
  );
}
