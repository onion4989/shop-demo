// app/(admin)/dashboard/layout.tsx などサーバー側での認可ガード
// app/(admin)/dashboard/layout.tsx
import "@/app/globals.css";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/providers/nextauth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent("/dashboard")}`);
  }
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}