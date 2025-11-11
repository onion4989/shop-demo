// app/(home)/search/page.tsx
import dynamic from "next/dynamic";
import { PrismaClient } from "@prisma/client";
import { SWRConfig } from "swr";

const ClientSearch = dynamic(() => import("./clientSearch"), { ssr: false });

export default async function Page() {
  // 初回は全件（= /api/search と同じ SELECT）を取得しておく
  const prisma = new PrismaClient();
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      orderBy: { recommend: "asc" },
      select: {
        productId: true, name: true, price: true,
        category: { select: { name: true } },
        images: { select: { thumbnailUrl: true } },
        option: true,
      },
    }),
    prisma.product.count(),
  ]);

  // SWR のキーとデータを一致させる（クエリなし=全件）
  const initialKey = "/api/search";
  const initialData = { products, total };

  return (
    <main className="w-[100%] lg:w-[1200px] m-auto">
      <section className="my-24">
        <SWRConfig value={{ fallback: { [initialKey]: initialData } }}>
          <ClientSearch />
        </SWRConfig>
      </section>
    </main>
  );
}
