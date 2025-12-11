// /app/(admin)/dashboard/category-regist/page.tsx
import { prisma } from "@/lib/server/prisma";
import { CategoryRegisterForm } from "@/features/admin/components/CategoryRegisterForm";
import { CategoryTable } from "@/features/admin/components/CategoryTable";

export default async function CategoryRegisterPage() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });

  // クライアントに渡すため、必要な項目だけのプレーンオブジェクトにする
  const categoryItems = categories.map((cat) => ({
    id: cat.id,
    categoryId: cat.categoryId,
    name: cat.name,
  }));

  return (
    <main className="min-h-screen px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-xl space-y-8">
        {/* ページタイトル */}
        <div>
          <h1 className="text-2xl font-bold mb-2">カテゴリ登録</h1>
          <p className="text-sm text-muted-foreground">
            商品のカテゴリを登録します。カテゴリIDは接頭辞として利用されます。
            例: CUP（カップケーキ） / ICE（アイスクリーム）
          </p>
        </div>

        {/* HeroUI Table でカテゴリ一覧を表示（クライアントコンポーネント） */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">現在登録されているカテゴリ</h2>
          <CategoryTable categories={categoryItems} />
        </section>

        {/* 既存のカテゴリ入力フォーム */}
        <CategoryRegisterForm />
      </div>
    </main>
  );
}
