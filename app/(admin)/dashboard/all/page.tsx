import Image from "next/image";
import Link from "next/link";
import SearchFroms from "@/app/ui/search/forms";
import { fetchFilteredProducts } from "@/app/lib/data";
import { EditButton } from "@/app/ui/dashboard/control/button";

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

  const { products } = await fetchFilteredProducts(query, category, Number(price), options);

  return (
    <>
      <div className="col-span-10 grid grid-cols-4 gap-4 bg-white p-4 rounded-lg">
        <SearchFroms />
      </div>
      <div className="my-4">
        <div className="grid grid-cols-8 gap-4 bg-white rounded-lg py-4 text-center">
          <div className="">商品ID</div>
          <div className="">サムネイル</div>
          <div className="">カテゴリ</div>
          <div className="">商品名</div>
          <div className="">価格</div>
          <div className="">オプション</div>
          <div>編集</div>
          <div>削除</div>
        </div>

        {products.length === 0 ? (
          <p className="text-white my-8">該当する対象製品は見つかりませんでした。</p>
        ) : (
          products.map((item, id) => (
            <div
              key={item.category.name + "_" + id}
              className="grid grid-cols-8 items-center gap-4 h-auto text-white py-4 border-b-1 border-slate-700 text-center"
            >
              <p>{item.productId}</p>
              <p>
                <Image
                  src={`/assets/${item.images[0].thumbnailUrl}`}
                  width={70}
                  height={64}
                  alt={`${item.name}`}
                  style={{ width: "70px", height: "64px" }}
                  className="rounded-large m-auto"
                  priority={false}
                />
              </p>
              <p>{item.category.name}</p>
              <p>{item.name}</p>
              <p>{item.price}</p>
              <p>
                {item.option ? (
                  <>
                    {[
                      item.option.takeoutAvailable && "テイクアウト可",
                      item.option.seasonal && "季節限定",
                      item.option.bulkPurchase && "まとめ買い対象",
                      item.option.couponAvailable && "クーポン可",
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  </>
                ) : (
                  "-"
                )}
              </p>
              <p>
                {/* <Link href={`/dashboard/edit?productid=${item.productId}`} className="">
                  編集
                </Link> */}
                <EditButton productid={item.productId} />
              </p>
              <p>
                <Link href={`/delete`} className="">
                  削除
                </Link>
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
