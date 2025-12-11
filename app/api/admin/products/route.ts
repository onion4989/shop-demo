// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth/authorization";
import { prisma } from "@/lib/server/prisma";
import { AdminProductSearchSchema } from "@/schemas/api";
import type { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // 認証・認可チェック（管理者のみ）
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // リクエストボディのバリデーション
    const rawBody = await req.json();
    const validated = AdminProductSearchSchema.safeParse(rawBody);
    
    if (!validated.success) {
      // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("[admin products API] validation error:", validated.error);
      }
      return NextResponse.json(
        { error: "無効なパラメータです。" },
        { status: 400 }
      );
    }

    const body = validated.data;

  const {
    keyword,
    categoryId,
    priceRange,
    takeoutAvailable,
    seasonal,
    bulkPurchase,
    couponAvailable,
    recommendedOnly,
  } = body;

  const where: Prisma.ProductWhereInput = {};

  // キーワード: productId / name
  if (keyword && keyword.trim() !== "") {
    where.OR = [
      { productId: { contains: keyword, mode: "insensitive" } },
      { name: { contains: keyword, mode: "insensitive" } },
    ];
  }

  // カテゴリ: Category.categoryId (String) を参照
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // 価格帯
  switch (priceRange) {
    case "UNDER_500":
      where.price = { lt: 500 };
      break;
    case "BETWEEN_500_999":
      where.price = { gte: 500, lt: 1000 };
      break;
    case "BETWEEN_1000_1999":
      where.price = { gte: 1000, lt: 2000 };
      break;
    case "OVER_2000":
      where.price = { gte: 2000 };
      break;
    case "ALL":
    default:
      break;
  }

  // Option テーブルのフラグ
  const optionFilter: Prisma.OptionWhereInput = {};
  if (takeoutAvailable) optionFilter.takeoutAvailable = true;
  if (seasonal) optionFilter.seasonal = true;
  if (bulkPurchase) optionFilter.bulkPurchase = true;
  if (couponAvailable) optionFilter.couponAvailable = true;

  if (Object.keys(optionFilter).length > 0) {
    where.option = optionFilter;
  }

  // おすすめ: recommend > 0
  if (recommendedOnly) {
    where.recommend = { gt: 0 };
  }

  const [totalCount, filteredCount, filteredProducts] = await Promise.all([
    prisma.product.count(),             // 全商品数（条件なし）
    prisma.product.count({ where }),    // 条件一致の件数
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { name: true },
        },
        images: {
          select: { thumbnailUrl: true },
          take: 1,
        },
      },
      orderBy: [
        { recommend: "desc" }, // おすすめ優先
        { productId: "asc" },
      ],
    }),
  ]);

  const products = filteredProducts.map((p) => ({
    id: p.id,
    productId: p.productId,
    name: p.name,
    price: p.price,
    categoryName: p.category.name,
    thumbnailUrl: p.images[0]?.thumbnailUrl ?? null,
    recommend: p.recommend,
  }));

    return NextResponse.json({
      products,
      totalCount,
      filteredCount,
    });
  } catch (error) {
    // セキュリティ: 本番環境では詳細なエラー情報をログに出力しない
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("[admin products API] error:", error);
    }
    
    // エラーの種類に応じて適切なステータスコードを返す
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "認証が必要です。" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "検索に失敗しました。" },
      { status: 500 }
    );
  }
}
