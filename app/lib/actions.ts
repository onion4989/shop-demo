"use server";

import { signIn } from "next-auth/react";
import { z } from "zod";

// フォームデータの型チェック（任意ですが推奨）
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
    const result = await signIn("credentials", {
      redirect: false, // サーバーアクションでは false にする
      email: parsed.email,
      password: parsed.password,
    });

    if (!result || !result.ok) {
      return "Invalid credentials."; // 認証失敗
    }

    return "Success"; // 認証成功
  } catch (error: any) {
    // Zod のバリデーションエラー
    if (error?.errors) {
      return "Invalid input.";
    }

    // それ以外のエラー
    return "Something went wrong.";
  }
}