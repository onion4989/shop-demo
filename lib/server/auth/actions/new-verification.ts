// /home/takashi_ogawa/shop-demo/lib/server/auth/actions/new-verification.ts
"use server";

import { prisma } from "@/lib/server/prisma";
import { getUserByEmail } from "@/lib/server/auth/data/user";
import { getVerificationTokenByToken } from "@/lib/server/auth/data/verificationToken";
//import { getJstTimestamp, getTokenExpiryInJst } from "@/lib/timestamp";

export const newVerification = async (token: string) => {
  // トークンは存在するか？
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "★★トークンが存在しないため、認証できません。" };
  }

  // 有効期限内か？
  const hasExpired = new Date(existingToken.expires) < new Date();
  //console.log("getTokenExpiryInJst(token): " + getTokenExpiryInJst(existingToken.expires));
  //console.log("getJstTimestamp(): " + getJstTimestamp());
  //const hasExpired = getTokenExpiryInJst(existingToken.expires) < getJstTimestamp();
  if (hasExpired) {
    return { error: "認証の有効期限が切れています!" };
  }

  // トークンに基づくメールアドレスは存在するか？
  const existingUser = await getUserByEmail(existingToken.identifier);
  if (!existingUser) {
    return { error: "メールアドレスは存在しません!" };
  }

  // トークンが有効な場合、メールに基づくトークンを更新
  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.identifier,
    },
  });

  // 検証完了後は、トークンが不要になるため削除（再利用や不正利用を防ぐ）
  await prisma.verificationToken.delete({
    where: { token: existingToken.token },
  });

  return { success: "メールが認証されました!" };
};
