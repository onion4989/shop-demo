import { prisma } from "@/lib/server/prisma";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({ where: { userId } });
    return twoFactorConfirmation;
  } catch (error) {
    console.error("[getTwoFactorConfirmationByUserId] error:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
};
