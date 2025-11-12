export default function FooterInfo() {
  return (
    <section className="grid grid-cols-3 mb-24">
      <div className="px-8 text-center">
        <p className="text-6xl font-bold">AI Cake</p>
        <p className="py-4">ご注文・お問い合わせ</p>
        <p className="text-4xl font-bold">058-XXXX-XXXX</p>
        <p className="py-2">受付時間： 10:00 ～ 17:00</p>
      </div>
      <div className="border-x-1 border-gray-200 px-8">
        <h3 className="text-2xl font-bold text-center">INFO</h3>
        <ul className="py-8">
          <li className="flex pb-3">
            <div className="w-20 border-r-1 font-bold">住所</div>
            <div className="px-4">
              <p>〒500 - XXXX</p>
              <p>○○県○○市○○町○○ 1-1-1</p>
            </div>
          </li>
          <li className="flex pb-3">
            <div className="w-20 border-r-1 font-bold">営業時間</div>
            <div className="px-4">9:30 - 18:30</div>
          </li>
          <li className="flex pb-3">
            <div className="w-20 border-r-1 font-bold">定休日</div>
            <div className="px-4">水曜日</div>
          </li>
        </ul>
        <p className="pb-3">○○インターチェンジより南に直進20分</p>
        <p className="pb-3">○○駅より徒歩15分</p>
      </div>
      <div className="px-8">
        <h3 className="text-2xl font-bold text-center">MENU</h3>
        <ul className="py-8">
          <li>商品一覧</li>
          <li className="py-2">お問い合わせ</li>
          <li>ご注文について</li>
          <li className="py-2">お支払いについて</li>
          <li>ギフト・プレゼントについて</li>
          <li className="py-2">注文後の変更について</li>
        </ul>
      </div>
    </section>
  );
}
