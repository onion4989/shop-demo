// app/(admin)/dashboard/top/layout.tsx
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Top",
};

export default function DashboardTopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ここでは「余計なレイアウト」を追加しない
  // 親の app/(admin)/dashboard/layout.tsx がすべてのレイアウトを担当する
  return <>{children}</>;
}
