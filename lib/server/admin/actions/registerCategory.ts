// /lib/server/admin/actions/registerCategory.ts
"use server";

import { prisma } from "@/lib/server/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server/auth/authorization";
import {
  CategoryRegisterSchema,
  type CategoryRegisterInput,
} from "@/schemas/Index";

export async function registerCategory(values: CategoryRegisterInput) {
  // 認可チェック（管理者のみ）
  const session = await requireAdmin();
  if (!session) {
    return { error: "権限がありません。" };
  }

  const parsed = CategoryRegisterSchema.safeParse(values);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "入力内容に誤りがあります。";
    return { error: message };
  }

  const data = parsed.data;

  const upperCategoryId = data.categoryId.toUpperCase();

  try {
    const category = await prisma.category.create({
      data: {
        categoryId: upperCategoryId,
        name: data.name,
      },
    });

    // 商品登録画面のカテゴリセレクト用
    revalidatePath("/dashboard/regist");
    // ★ カテゴリ登録画面の一覧も再検証
    revalidatePath("/dashboard/category-regist");

    return {
      success: "カテゴリを登録しました。",
      category,
    };
  } catch (error: unknown) {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      console.error("[registerCategory] error:", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Prisma の一意制約違反エラーをチェック
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { error: "このカテゴリIDは既に登録されています。" };
    }

    return { error: "カテゴリの登録に失敗しました。" };
  }
}
