// app/(admin)/dashboard/layout.tsx
import React from "react";
import "@/app/globals.css";
import ClientProviders from "../../components/(dashboard)/clientProviders";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 注意: ここはネストされた layout なので <html> と <body> は書かない
  return <ClientProviders>{children}</ClientProviders>;
}
