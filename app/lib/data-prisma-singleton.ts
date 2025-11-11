// app/lib/data-prisma-singleton.ts
import { PrismaClient } from "@prisma/client";

// グローバル変数にキャッシュして、開発中のHMR（ホットリロード）でも再生成しないようにする
declare global {
  // eslint-disable-next-line no-var
  var __PRISMA__: PrismaClient | undefined;
}

/**
 * Prisma Client のシングルトンインスタンス。
 * - 本番環境: 毎回新規作成（プロセス単位）
 * - 開発環境: グローバル変数で保持してHMR再生成を防止
 */
export const prisma =
  global.__PRISMA__ ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// 開発環境では globalThis にキャッシュ
if (process.env.NODE_ENV !== "production") {
  global.__PRISMA__ = prisma;
}

// PrismaClient 型を export しておくと他ファイルでも型安全に使える
export type PrismaSingleton = typeof prisma;
