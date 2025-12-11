// app/(admin)/dashboard/all/page.tsx
import dynamic from "next/dynamic";
import { prisma } from "@/lib/server/prisma";
import type { AdminCategoryOption } from "@/lib/types";

const AdminProductListClient = dynamic(
  () =>
    import("@/features/admin/dashbord-all/AdminProductListClient").then(
      (m) => m.AdminProductListClient,
    ),
);

export default async function AdminAllPage() {
  const totalCountPromise = prisma.product.count();

  const categoriesPromise = prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      categoryId: true,
      name: true,
    },
  });

  const [totalCount, categories] = await Promise.all([
    totalCountPromise,
    categoriesPromise,
  ]);

  return (
    <div className="space-y-6">
      <AdminProductListClient
        initialTotalCount={totalCount}
        categories={categories as AdminCategoryOption[]}
      />
    </div>
  );
}
