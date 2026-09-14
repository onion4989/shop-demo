// features/search/components/TermFilter.tsx
"use client";

import { Input } from "@heroui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function InputTerm() {
  // Input Term
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.delete("page");
    if (term) params.set("query", term);
    replace(`${pathname}?${params.toString()}`, { scroll:false });
  }, 300);

  return (
    <Input
      label="検索ワードを入力..."
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
      defaultValue={searchParams.get("query")?.toString()}
    />
  );
}
