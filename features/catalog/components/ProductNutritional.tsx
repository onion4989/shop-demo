// features/catalog/components/ProductNutritional.tsx
import type { ProductNutriRow } from "@features/catalog/Loaders";

export default function NutritionalTable({
  nutri,
}: {
  nutri?: ProductNutriRow | null;
}) {
  return (
    <table className="block whitespace-nowrap">
      <thead>
        <tr className="bg-gray-100 text-sm p-2 rounded-lg flex gap-2">
          <th className="w-[100px] font-normal">エネルギー</th>
          <th className="w-[100px] font-normal">たんぱく質</th>
          <th className="w-[100px] font-normal">脂質</th>
          <th className="w-[100px] font-normal">炭水化物</th>
          <th className="w-[100px] font-normal">食塩相当量</th>
          <th className="w-[200px] font-normal">アレルギー表示（28品目中）</th>
        </tr>
      </thead>
      <tbody>
        <tr className="flex gap-2 text-center p-2">
          <td className="w-[100px]">
            {nutri?.energy ? (
              <>
                {nutri.energy}
                <span className="text-xs ml-1">kcal</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {nutri?.protein ? (
              <>
                {nutri.protein}
                <span className="text-xs ml-1">g</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {nutri?.fat ? (
              <>
                {nutri.fat}
                <span className="text-xs ml-1">g</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {nutri?.carbohydrates ? (
              <>
                {nutri.carbohydrates}
                <span className="text-xs ml-1">g</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {nutri?.saltEquivalent ? (
              <>
                {nutri.saltEquivalent}
                <span className="text-xs ml-1">g</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[200px]">{nutri?.allergen ? nutri.allergen : "-"}</td>
        </tr>
      </tbody>
    </table>
  );
}
