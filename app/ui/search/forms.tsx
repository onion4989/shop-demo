import React from "react";
import InputTerm from "@/app/ui/control/term";
import SelectCategory from "@/app/ui/control/category";
import SelectPrice from "@/app/ui/control/price";
import CheackdOptions from "@/app/ui/control/options";
import { fetchCategory } from "@/app/lib/data";

export default async function SearchFroms() {
  // ここでカテゴリを取得
  const category = await fetchCategory();

  return (
    <>
      <div>
        <InputTerm />
      </div>
      <div>
        <SelectCategory category={category} />
      </div>
      <div>
        <SelectPrice />
      </div>
      <div>
        <CheackdOptions />
      </div>
    </>
  );
}
