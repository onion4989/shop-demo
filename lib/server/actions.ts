"use server";

import { signIn } from "@/lib/server/auth";
import { z } from "zod";

// フォームデータの型チェック
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authenticate(formData: FormData) {
  try {
    // FormData から値を取得
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    // 型チェック
    const parsed = loginSchema.parse({ email, password });

    // NextAuth signIn をサーバーアクションから呼び出す
    await signIn("credentials", {
      email: parsed.email,
      password: parsed.password,
      redirectTo: "/dashboard",
    });

    return "Success"; // 認証成功
  } catch (error: unknown) {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      console.error("[authenticate] error:", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Zod のバリデーションエラー
    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray(error.errors)
    ) {
      return "Invalid input.";
    }

    // それ以外のエラー
    return "Something went wrong.";
  }
}