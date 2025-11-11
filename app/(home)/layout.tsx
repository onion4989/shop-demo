import React from "react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/globals.css";
import Footer from "@/components/footer";
import FooterBar from "@/components/footer/footer-bar";
import Header from "@/components/header/navi";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Cake Shop Demo",
    default: "Home",
  },
  description: "AIケーキショップ。カップケーキ、アイスケーキなどおいしいケーキがたくさん!",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${inter.className}`}>
        <Header />
        {children}
        <Footer />
        <FooterBar />
      </body>
    </html>
  );
}
