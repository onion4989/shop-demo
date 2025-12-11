// /lib/server/admin/actions/updateCategory.ts
"use server";

import { prisma } from "@/lib/server/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server/auth/authorization";
import * as z from "zod";

const UpdateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "カテゴリ名は必須です"),
});

type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

export async function updateCategory(values: UpdateCategoryInput) {
  // 認可チェック（管理者のみ）
  const session = await requireAdmin();
  if (!session) {
    return { error: "権限がありません。" };
  }

  const parsed = UpdateCategorySchema.safeParse(values);

  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "入力内容に誤りがあります。";
    return { error: message };
  }

  const { id, name } = parsed.data;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    // 商品登録画面 & カテゴリ登録画面を再検証
    revalidatePath("/dashboard/regist");
    revalidatePath("/dashboard/category-regist");

    return {
      success: "カテゴリを更新しました。",
      category,
    };
  } catch (error: unknown) {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      console.error("[updateCategory] error:", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return { error: "カテゴリの更新に失敗しました。" };
  }
}
