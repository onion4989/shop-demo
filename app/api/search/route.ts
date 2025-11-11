// app/api/search/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: Request) {

  // URLから param queryを取得
  const { searchParams } = new URL(req.url);
  const query    = searchParams.get("query") ?? "";
  const category = searchParams.get("category") ?? "";
  const price    = searchParams.get("price") ?? "";
  const options  = searchParams.get("options") ?? "";

  // "undefined" / "null" は空扱いに正規化
  const norm = (v: string) => (v && v !== "undefined" && v !== "null" ? v : "");
  const q  = norm(query);
  const cat = norm(category);
  const pr  = norm(price);
  const opt = norm(options);

  const where: any = {};
  if (q)   where.name = { contains: q };
  if (cat) where.categoryId = cat;
  if (pr)  where.price = { lte: Number(pr) };
  if (opt) {
    where.option = {
      AND: opt.split(",").map((k) => ({ [k]: true })),
    };
  }

  // ここが肝：where が空なら「全件」
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,                                   // 空={} のとき全件
      orderBy: { recommend: "asc" },
      select: {
        productId: true,
        name: true,
        price: true,
        category: { select: { name: true } },
        images: { select: { thumbnailUrl: true } },
        option: true,
      },
      // 必要に応じて take/skip を付ける（大規模データ対策）
      // take: 50,
    }),
    prisma.product.count(),
  ]);

  return NextResponse.json({ products, total });
}
