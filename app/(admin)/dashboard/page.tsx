// app/(admin)/dashboard/page.tsx
import SignOutButton from "@/app/components/(dashboard)/login/signOutButton";
import SideNav from "@/app/ui/dashboard/sidenav";


export default function DashboardPage() {
  return (
    <>
      <div className="relative min-h-screen bg-gray-100">
        {/* 左カラム */}
        <aside className="fixed top-0 left-0 h-screen w-[250px] bg-cyan-500 text-white p-4">
          <h1>管理画面</h1>
          <SignOutButton />
          <SideNav />
        </aside>

        {/* メインコンテンツ（右側） */}
        <main className="ml-56 p-6">
          <div className="max-w-[1200px] mx-auto p-6">

            {/*上部バー*/}
            <div className="bg-gray-700 text-gray-200 rounded-md p-4 mb-4 text-center">
              ダッシュボード / Dashboard
            </div>

            {/* 12カラムグリッド */}
            <div className="grid grid-cols-12 gap-4">
              {/* 指標カード（3つ）*/}
              <div className="col-span-12 lg:col-span-3 bg-gray-700 text-gray-200 rounded-md p-4 text-center">
                <p className="font-semibold">商品登録数</p>
              </div>
              <div className="col-span-12 lg:col-span-3 bg-gray-700 text-gray-200 rounded-md p-4 text-center">
                <p className="font-semibold">1週間の販売数</p>
                <p className="text-2xl mt-2">27</p>
              </div>
              <div className="col-span-12 lg:col-span-3 bg-gray-700 text-gray-200 rounded-md p-4 text-center">
                <p className="font-semibold">総販売数</p>
                <p className="text-2xl mt-2">251</p>
              </div>

              {/* 円グラフカード（右側大）*/}
              <div className="col-span-12 lg:col-span-3 bg-gray-700 text-gray-200 rounded-md p-4">
                <p className="font-semibold mb-4 text-center">カテゴリ別売上比率</p>
                <div className="mx-auto aspect-square w-40 rounded-full bg-gray-200"></div>
              </div>

              {/* 売り上げ順（左ワイド）*/}
              <div className="col-span-12 lg:col-span-9 bg-gray-700 text-gray-200 rounded-md p-4">
                <p className="font-semibold mb-3">売り上げ順</p>
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
              <div className="col-span-12 lg:col-span-3 bg-gray-700 text-gray-200 rounded-md p-4 min-h-[220px]"></div>

              {/* 下段：グラフ（左ワイド）*/}
              <div className="col-span-12 lg:col-span-9 bg-gray-700 text-gray-200 rounded-md p-6 min-h-[260px]">
                <p className="mb-4">グラフ</p>
                <div className="flex items-center justify-center h-full opacity-80">Analytics ?</div>
              </div>

              {/* 右側の縦長カード（下段も同じ位置に継続表示）*/}
              <div className="col-span-12 lg:col-span-3 bg-gray-700 text-gray-200 rounded-md p-4 min-h-[260px]"></div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}