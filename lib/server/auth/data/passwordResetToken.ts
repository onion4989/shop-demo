import { prisma } from "@/lib/server/prisma";

export const getPasswordRestTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch (error) {
    console.error("[getPasswordRestTokenByToken] error:", {
      token: token.substring(0, 10) + "...", // セキュリティ: トークンの一部のみログ
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
};

export const getPasswordRestTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordResetToken;
  } catch (error) {
    console.error("[getPasswordRestTokenByEmail] error:", {
      email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
};
