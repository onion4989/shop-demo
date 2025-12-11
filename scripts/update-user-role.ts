// scripts/update-user-role.ts
// ユーザーのロールを更新するスクリプト（開発用）

import { prisma } from "../lib/server/prisma";

/**
 * 指定されたメールアドレスのユーザーをADMINロールに更新
 * 
 * 使用方法:
 * npx tsx scripts/update-user-role.ts <email>
 * 
 * 例:
 * npx tsx scripts/update-user-role.ts admin@example.com
 */
async function updateUserRole() {
  const email = process.argv[2];

  if (!email) {
    console.error("使用方法: npx tsx scripts/update-user-role.ts <email>");
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`ユーザーが見つかりません: ${email}`);
      process.exit(1);
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`ユーザーのロールを更新しました:`);
    console.log(`  メールアドレス: ${updatedUser.email}`);
    console.log(`  ロール: ${updatedUser.role}`);
  } catch (error) {
    console.error("エラーが発生しました:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole();

