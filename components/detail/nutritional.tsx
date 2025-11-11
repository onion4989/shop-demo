// app/components/detail/nutritional.tsx
import { getNutritionalInfoCached } from "@/app/lib/data";

export default async function NutritionalTable(params: { productid: string }) {
  const nutritional = await getNutritionalInfoCached(params.productid);
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
            {nutritional?.energy ? (
              <>
                {nutritional.energy}
                <span className="text-xs ml-1">kcal</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {nutritional?.protein ? (
              <>
                {nutritional.protein}
                <span className="text-xs ml-1">kcal</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {nutritional?.fat ? (
              <>
                {nutritional.fat}
                <span className="text-xs ml-1">kcal</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {nutritional?.carbohydrates ? (
              <>
                {nutritional.carbohydrates}
                <span className="text-xs ml-1">kcal</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {nutritional?.saltEquivalent ? (
              <>
                {nutritional.saltEquivalent}
                <span className="text-xs ml-1">kcal</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[200px]">{nutritional?.allergen ? nutritional?.allergen : "-"}</td>
        </tr>
      </tbody>
    </table>
  );
}
