// features/catalog/components/ProductsCarousel.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay"; 

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import RenderResult from "next/dist/server/render-result";

// ランク表示用のバッジ（小カード時と同じイメージ）
const circleMiddleNumber = [
  "absolute -top-2 -left-3 z-10",
  "flex items-center justify-center",
  "text-xs text-white font-bold",
  "bg-[#EC3F9C] rounded-full",
  "w-[28px] h-[28px]",
  "outline outline-2 outline-white",
].join(" ");

type CarouselProduct = {
  id: number;
  productId: string;
  name: string;
  price: number;
  recommend: number | string;
  images?: { thumbnailUrl: string | null }[];
};

type ProductsCarouselProps = {
  products: CarouselProduct[];
};

export function ProductsCarousel({ products }: ProductsCarouselProps) {
  if (!products?.length) return null;

  // 最大 10 件に制限
  const visibleProducts = products.slice(0, 10);

  // Autoplay プラグイン（4秒おき）
  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
    })
  );

  return (
    <Carousel
      // 右 → 左へスライド
      opts={{
        align: "center",
        loop: true,
        direction: "rtl",
      }}
      dir="rtl"
      plugins={[autoplayPlugin.current]}
      className="w-full"
      onMouseEnter={autoplayPlugin.current.stop}
      onMouseLeave={autoplayPlugin.current.reset}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {visibleProducts.map((item, index) => {
          const thumb = item.images?.[0]?.thumbnailUrl ?? null;

          return (
            <CarouselItem
              key={item.id}
              className="
                pl-2 md:pl-4
                flex justify-center
                basis-1/2
                sm:basis-1/3
                md:basis-1/4
                lg:basis-1/5
                xl:basis-1/6
              "
            >
              <Link
                href={`/catalog/${item.productId}`}
                className="block"
                prefetch={false}
              >
                {/* カード本体: 180 x 288, padding 4px */}
                <div
                  className="
                    relative
                    w-[180px] h-[288px]
                    bg-background
                    rounded-large
                    shadow-sm
                    p-1
                    flex flex-col items-center
                  "
                >
                  {/* ランクバッジ（左上） */}
                  <div className={circleMiddleNumber}>
                    {item.recommend ?? index + 1}
                  </div>

                  {/* 画像: 160 x 150 */}
                  <div className="mt-4 flex justify-center w-full">
                    {thumb && (
                      <Image
                        src={`/assets/${thumb}`}
                        width={160}
                        height={150}
                        alt={item.name}
                        loading="lazy"
                        className="
                          w-[160px] h-[150px]
                          rounded-large
                          object-cover
                        "
                        sizes="160px"
                        placeholder="empty"
                      />
                    )}
                  </div>

                  {/* 商品説明（画像の下） */}
                  <div className="mt-3 w-full flex-1 flex flex-col justify-start px-1">
                    <p className="text-xs font-bold line-clamp-2">
                      {item.name}
                    </p>
                    <p className="mt-2 text-xs">
                      ￥{item.price}
                      <span className="text-[10px]">(税込)</span>
                    </p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {/* ナビゲーションボタン（必要な場合） */}
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
