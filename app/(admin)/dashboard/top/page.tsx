// app/(admin)/dashboard/top/page.tsx
import React from "react";

const backGroundStyles = "text-slate-300 bg-slate-700 rounded-lg";

export default function DashBoard() {
  return (
    <div className="">
      <div className={`${backGroundStyles} mb-4 p-4`}>ダッシュボード / Dashboard</div>
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-6">
          <div className="grid grid-cols-3 gap-4">
            <div className={`${backGroundStyles} h-[152px]`}>商品登録数</div>
            <div className={`${backGroundStyles} h-[152px]`}>1週間の販売数</div>
            <div className={`${backGroundStyles} h-[152px]`}>総販売数</div>
          </div>
          <div className="col-span-6 my-4" aria-label="">
            <div className={`${backGroundStyles} col-span-4 h-[296px]`}>折れ線チャートグラフ</div>
          </div>
          <div className={`${backGroundStyles} col-span-6 h-[296px]`}>Anatylics Graph</div>
        </div>
        <div className="col-span-4 grid gap-4" aria-label="">
          <div className={`${backGroundStyles} h-full`}>円グラフ</div>
          <div className={`${backGroundStyles} h-full`}>Infomations</div>
        </div>
      </div>
    </div>
  );
}
