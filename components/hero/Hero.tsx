"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type CardTypes = {
  id: number;
  filename: string;
  className: string;
  alt: string;
  x: number;      // 最終 X 位置
  y: number;      // 最終 Y 位置
  rotate: number; // 最終回転
  zIndex: number; // 重なり順
};

const HeroCards: CardTypes[] = [
  {
    id: 1,
    filename: "HeroCard-Images1.jpg",
    className: "-rotate-16 -translate-x-32 z-10",
    alt: "店舗外観",
    x: -120,
    y: 0,
    rotate: -16,
    zIndex: 10,
  },
  {
    id: 2,
    filename: "HeroCard-Images2.jpg",
    className: "-rotate-6 -translate-x-4 z-20",
    alt: "アイスクリーム",
    x: 0,
    y: 0,
    rotate: -6,
    zIndex: 20,
  },
  {
    id: 3,
    filename: "HeroCard-Images3.jpg",
    className: "rotate-10 translate-x-28 translate-y-4 z-30",
    alt: "カップケーキ",
    x: 120,
    y: 20,
    rotate: 10,
    zIndex: 30,
  },
];

type ImageTypes = {
  id: number;
  filename: string;
  className: string;
  alt: string;
};

const HeroInfoImgs: ImageTypes[] = [
  { id: 1, filename: "HeroInfo-images1.jpg", className: "", alt: "店舗外観" },
  { id: 2, filename: "HeroInfo-images2.jpg", className: "", alt: "店舗外観" },
  { id: 3, filename: "HeroInfo-images3.jpg", className: "", alt: "店舗外観" },
  { id: 4, filename: "HeroInfo-images4.jpg", className: "", alt: "店舗外観" },
  { id: 5, filename: "HeroInfo-images5.jpg", className: "", alt: "店舗外観" },
];

export default function Page() {
  return (
    <>
      <section className="relative w-full h-[700px] overflow-hidden">
        {/* === カード3枚：中央に扇状配置 === */}
        <div 
          className="
            absolute top-10 left-1/2 
            -translate-x-1/2 
            w-[600px] h-[450px] 
            pointer-events-none
          "
        >
        {HeroCards.map((card, index) => (
          <motion.div
            key={card.id}
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{ zIndex: card.zIndex }}
            initial={{
              x: 0,
              y: 0,
              rotate: 0,
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              x: card.x,
              y: card.y,
              rotate: card.rotate,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.15, // 少しずつ時間差で広がる
              ease: "easeOut",
            }}
          >
            <Image
              src={`/assets/${card.filename}`}
              width={270}
              height={430}
              priority
              alt={card.alt}
              className="rounded-xl shadow-xl"
              style={{ width: "270px", height: "430px" }}
            />
          </motion.div>
        ))}
        </div>
          {/* === 下部の丸い画像５つ + ピンクバー === */}
          <div
              className="
              absolute bottom-40 left-1/2 -translate-x-1/2
              w-[996px]
            "
          >
          {/* ピンクのバー本体 */}
            <div
              className="
                relative w-full
                bg-[#FBC4C0]
                rounded-full
                py-12
              "
            >
              {/* 丸画像の行（バーから少し飛び出させる） */}
              <div
                className="
                  absolute inset-x-0 -top-14
                  flex justify-center items-center gap-6
                "
              >
              {HeroInfoImgs.map((card) => (
                <div key={card.id} className="relative">
                  <Image
                    src={`/assets/${card.filename}`}
                    width={130}
                    height={130}
                    alt={card.alt}
                    priority
                    className="rounded-full border-4 border-white shadow-lg"
                  />

                  {/* ★ バッジ（任意で付けられる） */}
                  <span
                    className="
                      absolute -top-2 right-0
                      px-2 py-[2px]
                      text-xs font-bold text-white
                      bg-pink-500
                      rounded-full shadow
                    "
                  >
                    New
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* === タイトル === */}
        <h1 
          className="
            absolute bottom-10 left-1/2 
            -translate-x-1/2
             text-7xl font-black tracking-wider 
             drop-shadow whitespace-nowrap
          "
        >
          CAKE SHOP DEMO
        </h1>
      </section>
    </>
  );
}
