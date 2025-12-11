// app/api/search/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { SearchQuerySchema } from "@/schemas/api";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    // URLから param queryを取得
    const { searchParams } = new URL(req.url);
    
    // バリデーション
    const params = {
      query: searchParams.get("query") ?? "",
      category: searchParams.get("category") ?? "",
      price: searchParams.get("price") ?? "",
      options: searchParams.get("options") ?? "",
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "50",
    };
    
    const validated = SearchQuerySchema.safeParse(params);
    if (!validated.success) {
      return NextResponse.json(
        { error: "無効なパラメータです。" },
        { status: 400 }
      );
    }

    const { query, category, price, options, page, limit } = validated.data;
    const skip = (page - 1) * limit;

    // "undefined" / "null" は空扱いに正規化
    const norm = (v: string | undefined) => (v && v !== "undefined" && v !== "null" ? v : "");
    const q = norm(query);
    const cat = norm(category);
    const pr = norm(price);
    const opt = norm(options);

    const where: Prisma.ProductWhereInput = {};
    if (q) where.name = { contains: q };
    if (cat) where.categoryId = cat;
    if (pr) {
      const priceNum = Number(pr);
      if (!isNaN(priceNum) && priceNum >= 0) {
        where.price = { lte: priceNum };
      }
    }
    if (opt) {
      // オプションのバリデーション（安全なキーのみ許可）
      const validOptions = ["takeoutAvailable", "seasonal", "bulkPurchase", "couponAvailable"];
      const optionKeys = opt.split(",").filter((k) => validOptions.includes(k));
      if (optionKeys.length > 0) {
        where.option = {
          AND: optionKeys.map((k) => ({ [k]: true })),
        };
      }
    }

    // ページネーション付きで商品を取得
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where, // 空={} のとき全件
        orderBy: { recommend: "asc" },
        select: {
          productId: true,
          name: true,
          price: true,
          category: { select: { name: true } },
          images: { select: { thumbnailUrl: true } },
          option: true,
        },
        take: limit,
        skip: skip,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  } catch (error) {
    console.error("[search API] error:", error);
    return NextResponse.json(
      { error: "検索に失敗しました。" },
      { status: 500 }
    );
  }
}
