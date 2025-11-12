// middleware.ts
export { default } from "next-auth/middleware";

// 管理画面だけ保護（必要に応じて増やす）
export const config = {
  matcher: ["/dashboard/:path*"], // 例: http://localhost:3001/dashboard/...
};
