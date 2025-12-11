"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas/Index";
import { getUserByEmail } from "@/lib/server/auth/data/user";
import { sendPasswordResetEmail } from "@/lib/server/auth/mail";
import { generatePasswordRestToken } from "@/lib/server/auth/tokens";

export const Reset = async (valuses: z.infer<typeof ResetSchema>) => {
  // 入力フィールドは有効か？
  const ValidatedField = ResetSchema.safeParse(valuses);
  if (!ValidatedField.success) {
    return { error: "無効なフィールドです!" };
  }

  // セキュリティ: ユーザー列挙攻撃を防ぐため、
  // メールアドレスの存在有無に関わらず同じメッセージを返す
  const { email } = ValidatedField.data;
  const existingUser = await getUserByEmail(email);
  
  // ユーザーが存在する場合のみトークンを生成してメール送信
  if (existingUser) {
    const passwordResetToken = await generatePasswordRestToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
  }

  // セキュリティ: 存在しない場合でも同じ成功メッセージを返す
  return { success: "リセットメールを送信しました。" };
};
