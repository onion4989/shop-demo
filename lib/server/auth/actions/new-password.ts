// /home/takashi_ogawa/shop-demo/lib/server/auth/actions/new-password.ts
"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/server/prisma";

import { NewPasswordSchema } from "@/schemas/Index";
import { getPasswordRestTokenByToken } from "@/lib/server/auth/data/passwordResetToken";
import { getUserByEmail } from "@/lib/server/auth/data/user";
//import { getJstTimestamp, getTokenExpiryInJst } from "@/lib/timestamp";

export const newPassword = async (valuses: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
  // パラメータにトークンは存在するか？
  if (!token) {
    return { error: "トークンが見つかりません!" };
  }

  // 入力されたパスワードは有効か？
  const ValidatedField = NewPasswordSchema.safeParse(valuses);
  if (!ValidatedField.success) {
    return { error: "無効なフィールドです!" };
  }

  // dbにトークンは存在するか？
  const { password } = ValidatedField.data;
  const existingToken = await getPasswordRestTokenByToken(token);
  if (!existingToken) {
    return { error: "トークンが見つかりませんでした!" };
  }

  // dbにあるトークンは有効期限内か？
  const hasExpiresd = new Date(existingToken.expires) < new Date();
  if (hasExpiresd) {
    return { error: "トークンが期限切れです!" };
  }

  // 登録されたメールアドレスは存在するか？
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "ユーザーが見つかりませんでした!" };
  }

  // パスワード暗号化
  const hashPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "パスワードを変更しました!" };
};
