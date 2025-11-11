// app/ui/search/hit.tsx
import { Divider } from "@nextui-org/react";

export default function HitNumber({ max, search }: { max: number; search: number }) {
  return (
    <div className="text-white bg-[#EC3F9C] rounded-xl p-4 w-full h-full flex flex-col justify-center items-center">
      <div className="flex justify-between items-center w-full">
        <span>検索結果</span>
        <span><span className="text-2xl font-bold">{search}</span>件</span>
      </div>
      <Divider className="my-4 bg-white" />
      <div className="flex justify-between items-center w-full">
        <span>総商品数</span>
        <span><span className="text-2xl font-bold">{max}</span>件</span>
      </div>
    </div>
  );
}
