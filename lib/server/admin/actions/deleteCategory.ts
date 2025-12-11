// /lib/server/admin/actions/deleteCategory.ts
"use server";

import { prisma } from "@/lib/server/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server/auth/authorization";
import * as z from "zod";

const DeleteCategorySchema = z.object({
  id: z.number(),
});

type DeleteCategoryInput = z.infer<typeof DeleteCategorySchema>;

export async function deleteCategory(values: DeleteCategoryInput) {
  // 認可チェック（管理者のみ）
  const session = await requireAdmin();
  if (!session) {
    return { error: "権限がありません。" };
  }

  const parsed = DeleteCategorySchema.safeParse(values);

  if (!parsed.success) {
    return { error: "削除対象が正しく指定されていません。" };
  }

  const { id } = parsed.data;

  try {
    // 1. 対象カテゴリを取得
    const category = await prisma.category.findUnique({
      where: { id },
      select: { categoryId: true, name: true },
    });

    if (!category) {
      return { error: "指定されたカテゴリが見つかりません。" };
    }

    // 2. 紐づく商品数を確認
    const productCount = await prisma.product.count({
      where: {
        categoryId: category.categoryId, // CUP, ICE などの接頭辞で紐づいている
      },
    });

    if (productCount > 0) {
      return {
        error: "このカテゴリには商品が登録されているため削除できません。",
      };
    }

    // 3. 商品が紐づいていなければ削除
    await prisma.category.delete({
      where: { id },
    });

    // 商品登録画面 & カテゴリ登録画面を再検証
    revalidatePath("/dashboard/regist");
    revalidatePath("/dashboard/category-regist");

    return {
      success: "カテゴリを削除しました。",
    };
  } catch (error: unknown) {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      console.error("[deleteCategory] error:", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return { error: "カテゴリの削除に失敗しました。" };
  }
}
