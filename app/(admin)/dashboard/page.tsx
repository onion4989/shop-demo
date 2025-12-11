// app/(admin)/dashboard/page.tsx
import SignOutButton from "@features/auth/components/SignOutButton";
import SideNav from "@features/admin/components/DashboardSideNav";


// app/(admin)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <>
      {/* 上部バー */}
      <div className="mb-4 rounded-md bg-gray-700 p-4 text-center text-gray-200">
        ダッシュボード / Dashboard
      </div>

      {/* 12カラムグリッド（中身は従来どおり） */}
      <div className="grid grid-cols-12 gap-4">
        {/* 指標カード（3つ） */}
        <div className="col-span-12 rounded-md bg-gray-700 p-4 text-center text-gray-200 lg:col-span-3">
          <p className="font-semibold">商品登録数</p>
        </div>
        <div className="col-span-12 rounded-md bg-gray-700 p-4 text-center text-gray-200 lg:col-span-3">
          <p className="font-semibold">1週間の販売数</p>
          <p className="mt-2 text-2xl">27</p>
        </div>
        <div className="col-span-12 rounded-md bg-gray-700 p-4 text-center text-gray-200 lg:col-span-3">
          <p className="font-semibold">総販売数</p>
          <p className="mt-2 text-2xl">251</p>
        </div>

        {/* 円グラフカード（右側大） */}
        <div className="col-span-12 rounded-md bg-gray-700 p-4 text-gray-200 lg:col-span-3">
          <p className="mb-4 text-center font-semibold">カテゴリ別売上比率</p>
          <div className="mx-auto aspect-square w-40 rounded-full bg-gray-200" />
        </div>

        {/* 売り上げ順（左ワイド） */}
        <div className="col-span-12 rounded-md bg-gray-700 p-4 text-gray-200 lg:col-span-9">
          <p className="mb-3 font-semibold">売り上げ順</p>
          <ul className="space-y-2 text-sm">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5 アイスとっカクリームバウム</li>
            <li>6 アイスとっカクリームバウム</li>
            <li>7 アイスとっカクリームバウム</li>
            <li>8 アイスとっカクリームバウム</li>
            <li>9 アイスとっカクリームバウム</li>
          </ul>
        </div>

        {/* 右側の縦長カード */}
        <div className="col-span-12 min-h-[220px] rounded-md bg-gray-700 p-4 text-gray-200 lg:col-span-3" />

        {/* 下段：グラフ（左ワイド） */}
        <div className="col-span-12 min-h-[260px] rounded-md bg-gray-700 p-6 text-gray-200 lg:col-span-9">
          <p className="mb-4">グラフ</p>
          <div className="flex h-full items-center justify-center opacity-80">
            Analytics ?
          </div>
        </div>

        {/* 右側の縦長カード（下段も同じ位置に継続表示） */}
        <div className="col-span-12 min-h-[260px] rounded-md bg-gray-700 p-4 text-gray-200 lg:col-span-3" />
      </div>
    </>
  );
}
