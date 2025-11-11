export const runtime = "nodejs"; // ← Prisma を使うので Node ランタイム固定
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categoryList = await prisma.category.findMany({
      select: { categoryId: true, name: true },
    });
    return NextResponse.json(categoryList);
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
