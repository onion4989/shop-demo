// /app/(admin)/dashboard/regist/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import { Button } from "@/components/ui/button";
import { ProductRegisterForm } from "@/features/admin/components/ProductRegisterForm";

export default async function ProductRegisterPage() {
  // カテゴリと商品件数を取得
  const [categories, productCount] = await Promise.all([
    prisma.category.findMany({
      orderBy: { id: "asc" },
    }),
    prisma.product.count(),
  ]);

  const hasCategory = categories.length > 0;

  if (!hasCategory) {
    // カテゴリが存在しない場合は、カテゴリ登録を促す
    return (
      <main className="min-h-screen px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-2xl font-bold">新規商品登録</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            まだカテゴリが登録されていません。
            <br />
            商品を登録する前に、先にカテゴリを登録してください。
          </p>
          <Button asChild className="cursor-pointer">
            {/* ★ カテゴリ登録ページのURLは実際の構成に合わせて変更してください */}
            <Link href="/dashboard/category-regist">カテゴリを登録する</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="mb-2 text-2xl font-bold">新規商品登録</h1>
          {/* 初回登録時の説明テキストは仕様により削除 */}
        </div>

        {/* カテゴリ一覧をフォームに渡す */}
        <ProductRegisterForm categories={categories} />
      </div>
    </main>
  );
}
