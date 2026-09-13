// /lib/env.ts
// 環境変数の検証と取得を行うユーティリティ

/**
 * 必須環境変数を取得し、存在しない場合はエラーを投げる
 * @param key 環境変数のキー
 * @returns 環境変数の値
 * @throws Error 環境変数が存在しない場合
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please set ${key} in your .env.local file or environment variables.`
    );
  }
  return value;
}

/**
 * オプショナルな環境変数を取得する
 * @param key 環境変数のキー
 * @param defaultValue デフォルト値（環境変数が存在しない場合）
 * @returns 環境変数の値またはデフォルト値
 */
export function getEnv(key: string, defaultValue?: string): string {
  return process.env[key] || defaultValue || "";
}

/**
 * アプリケーション起動時に必須環境変数を検証する
 * この関数はアプリケーションの起動時に一度だけ呼び出すことを推奨
 */
export function validateRequiredEnvVars() {
  const requiredVars = [
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
  ];

  const missingVars: string[] = [];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join("\n")}\n\n` +
      `Please set these variables in your .env.local file or environment variables.`
    );
  }
}
