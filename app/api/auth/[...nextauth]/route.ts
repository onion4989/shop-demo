import { authOptions } from "@/app/providers/nextauth";
import NextAuth from "next-auth";
import type { NextRequest } from "next/server";

// NextAuth のハンドラーを生成
const handler = NextAuth(authOptions);

// App Router に合わせて GET / POST をラップ
export async function GET(request: NextRequest) {
 return handler(request);
}
  
export async function POST(request: NextRequest) {
 return handler(request);
}
