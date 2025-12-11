import { prisma } from "@/lib/server/prisma";

export const getTwoFactorTokenbyToken = async (token: string) => {
  try {
    const toFactorToken = await prisma.twoFactorToken.findUnique({ where: { token } });
    return toFactorToken;
  } catch (error) {
    console.error("[getTwoFactorTokenbyToken] error:", {
      token: token.substring(0, 6) + "...", // セキュリティ: トークンの一部のみログ
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
};

export const getTwoFactorTokenbyEmail = async (email: string) => {
  try {
    const toFactorToken = await prisma.twoFactorToken.findFirst({ where: { email } });
    return toFactorToken;
  } catch (error) {
    console.error("[getTwoFactorTokenbyEmail] error:", {
      email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
};
