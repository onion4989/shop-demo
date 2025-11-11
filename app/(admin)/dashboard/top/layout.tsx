// app/(admin)/dashboard/top/layout.tsx
import React from "react";
import SideNav from "@/app/ui/dashboard/sidenav";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <section className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-900">
          <div className="w-full flex-none md:w-64 bg-slate-800 p-8 text-white">
            <h2 className=" text-2xl font-bold mb-2">製品</h2>
            <SideNav />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto">{children}</div>
        </section>
      </main>
    </>
  );
}
