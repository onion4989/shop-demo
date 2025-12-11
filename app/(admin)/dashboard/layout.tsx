// app/(admin)/dashboard/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/server/auth";

import SignOutButton from "@features/auth/components/SignOutButton";
import DashboardSideNav from "@features/admin/components/DashboardSideNav";
import ClientProviders from "./client-providers"; // 既存ファイルに合わせてパス調整

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // 認可ガード
  const session = await auth();

  if (!session || !session.user) {
    const callbackUrl = encodeURIComponent("/dashboard");
    redirect(`/auth/login?callbackUrl=${callbackUrl}`);
  }

  // 管理画面共通レイアウト
  return (
    <ClientProviders>
      <div className="relative min-h-screen bg-gray-100">
        {/* 左カラム（サイドバー） */}
        <aside className="fixed top-0 left-0 h-screen w-[250px] bg-cyan-500 text-white p-4">
          <h1 className="mb-4 text-lg font-semibold">管理画面</h1>

          <div className="mb-4">
            <SignOutButton />
          </div>

          <DashboardSideNav />
        </aside>

        {/* 右側メインコンテンツ */}
        <main className="ml-[250px] p-6">
          <div className="mx-auto max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </ClientProviders>
  );
}
