// app/(admin)/dashboard/all/page.tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AdminAllClient = dynamic(() => import("./adminAllClient"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <AdminAllClient />
    </Suspense>
  );
}
