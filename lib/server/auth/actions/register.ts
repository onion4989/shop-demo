"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas/Index";
import { prisma } from "@/lib/server/prisma";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/server/auth/data/user";
import { generateVerificationToken } from "@/lib/server/auth/tokens";
import { sendVerificationEmail } from "@/lib/server/auth/mail";

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  const ValidatedField = RegisterSchema.safeParse(values);
  // フィールドに問題がある場合は、return
  if (!ValidatedField.success) {
    return { error: "無効なフィールド" };
  }

  const { name, email, password } = ValidatedField.data;
  const existingUser = await getUserByEmail(email);
  
  // 一致するEmailがある場合は、return
  // セキュリティ: ユーザー列挙攻撃を防ぐため、エラーメッセージは簡潔に
  if (existingUser) {
    return { error: "このメールアドレスはすでに登録されています。" };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // ユーザー登録
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  // メールに基づく検証トークンを生成
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

  return { success: "確認メールを送信しました。" };
};
