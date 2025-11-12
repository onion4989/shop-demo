// app/cards/product-items.tsx
import { getTopProducts } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const circleLargeNumber = [
  "absolute -top-5 -left-4",
  "flex items-center justify-center",
  "text-2xl text-white font-bold",
  "bg-[#EC3F9C] rounded-full",
  "w-[45px] h-[45px]",
  "outline outline-3 outline-white",
  ].join(" ");

const circleMiddleNumber = [
  "absolute -top-4 -left-4",
  "flex items-center justify-center",
  "text-base text-white font-bold",
  "bg-[#EC3F9C] rounded-full",
  "w-[35px] h-[35px]",
  "outline outline-3 outline-white",
  ].join(" ");

export default async function ProductsItems() {
  const products = await getTopProducts(9); // 取得件数は必要分だけ

  if (!products.length) return null;

  const [firstProduct, ...rest] = products;

  return (
    <section className="w-[1200px] grid gap-6 sm:grid-cols-1 lg:grid-cols-12 m-auto my-24">
      {/* 先頭アイテム（大） */}
      <div className="relative sm:grid-cols-1 lg:col-span-4 w-[384px] max-h-[384px]">
        <Link href={`/search/${firstProduct.productId}`} className="w-full" prefetch={false}>
          <div className={circleLargeNumber}>{firstProduct.recommend}</div>
          <div className="absolute inset-x-0 bottom-4 bg-background/80 rounded-small mx-4 p-4">
            <h2 className="font-bold">{firstProduct.name}</h2>
            <p>
              ￥{firstProduct.price}
              <span className="text-xs">(税込)</span>
            </p>
          </div>

          {firstProduct.images?.[0]?.thumbnailUrl && (
            <Image
              src={`/assets/${firstProduct.images[0].thumbnailUrl}`}
              width={384}
              height={384}
              className="rounded-large h-full"
              alt={firstProduct.name}
              priority
              sizes="(max-width: 1024px) 100vw, 384px"
              placeholder="empty"
            />
          )}
        </Link>
      </div>

      {/* 残り（小） */}
      <div className="sm:grid-cols-2 lg:col-span-8">
        <div className="grid gap-6 gap-y-8 grid-cols-4">
          {rest.map((item) => {
            const thumb = item.images?.[0]?.thumbnailUrl;
            return (
              <Link key={item.id} href={`/search/${item.productId}`} className="w-full" prefetch={false}>
                <div className="relative w-full max-h-[176px]">
                  <div className={circleMiddleNumber}>{item.recommend}</div>
                  <div className="absolute inset-x-0 bottom-2 min-h-[64px] bg-background/80 rounded-small mx-2 py-2 px-4">
                    <h2 className="text-sm font-bold">{item.name}</h2>
                  </div>
                  {thumb && (
                    <Image
                      src={`/assets/${thumb}`}
                      width={180}
                      height={176}
                      className="rounded-large w-full h-full"
                      alt={item.name}
                      loading="lazy"
                      sizes="(max-width: 1024px) 50vw, 180px"
                      placeholder="empty"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
