export const runtime = "nodejs"; // ← Prisma を使うので Node ランタイム固定
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cats = await prisma.category.findMany({
      select: { id: true, name: true },
    });
    return NextResponse.json(cats);
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
