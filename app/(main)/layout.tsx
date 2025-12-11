// app/layout.tsx（Server Component）
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@features/ui/Providers";
import Navigations from "@components/header/Navigation";
import Footer from "@components/footer/Footer";
import FooterBar from "@components/footer/FooterBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | Cake Shop Demo", default: "Home" },
  description: "AIケーキショップ。カップケーキ、アイスケーキなどおいしいケーキがたくさん!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`min-h-dvh antialiased ${inter.className} bg-linear-to-b from-[#FED8DC] to-white`}>
        <Providers>
          <Navigations />
          {children}
          <Footer />
          <FooterBar />
        </Providers>
      </body>
    </html>
  );
}