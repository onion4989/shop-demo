// /home/takashi_ogawa/shop-demo/lib/server/auth/authorization.ts
// 認可（Authorization）チェック用のユーティリティ

import { auth } from "@/lib/server/auth";
import type { Session } from "next-auth";

/**
 * 現在のセッションを取得し、認証されているかチェック
 * @returns セッション（認証されていない場合はnull）
 */
export async function requireAuth(): Promise<Session | null> {
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  return session;
}

/**
 * 管理者権限が必要な操作の認可チェック
 * @returns セッション（管理者でない場合はnull）
 */
export async function requireAdmin(): Promise<Session | null> {
  const session = await requireAuth();
  if (!session) {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[requireAdmin] No session found");
    }
    return null;
  }
  
  // 型アサーションが必要な場合があるため、明示的にチェック
  const userRole = (session.user as any)?.role;
  
  // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[requireAdmin] User role:", userRole, "Session user:", {
      id: session.user?.id,
      email: session.user?.email,
      role: userRole,
    });
  }
  
  if (userRole !== "ADMIN") {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[requireAdmin] User is not ADMIN, role:", userRole);
    }
    return null;
  }
  
  return session;
}

/**
 * 管理者権限チェック（booleanを返す）
 * @returns 管理者の場合はtrue、それ以外はfalse
 */
export async function isAdmin(): Promise<boolean> {
  const session = await requireAdmin();
  return session !== null;
}

