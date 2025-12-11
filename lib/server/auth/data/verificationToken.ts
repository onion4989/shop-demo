// /home/takashi_ogawa/shop-demo/lib/server/auth/data/verificationToken.ts
import { prisma } from "@/lib/server/prisma";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    console.error("[getVerificationTokenByToken] error:", {
      token: token.substring(0, 10) + "...", // セキュリティ: トークンの一部のみログ
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: email },
    });
    return verificationToken;
  } catch (error) {
    console.error("[getVerificationTokenByEmail] error:", {
      email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
};
