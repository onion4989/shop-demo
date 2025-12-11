import { prisma } from "@/lib/server/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      console.error("[getUserByEmail] error:", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      console.error("[getUserById] error:", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
};
