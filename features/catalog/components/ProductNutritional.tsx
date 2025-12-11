// features/catalog/components/ProductNutritional.tsx
//import { notFound } from "next/navigation";
import { getNutritionalInfoCached } from "@features/catalog/Loaders";

export default async function NutritionalTable({
  productId,
}: {
  productId: string;
}) {
  const product = await getNutritionalInfoCached(productId);
  // if (!product) {
  //   notFound();
  // }
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
            {product?.energy ? (
              <>
                {product?.energy}
                <span className="text-xs ml-1">kcal</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {product?.protein ? (
              <>
                {product?.protein}
                <span className="text-xs ml-1">g</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {product?.fat ? (
              <>
                {product?.fat}
                <span className="text-xs ml-1">g</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {product?.carbohydrates ? (
              <>
                {product?.carbohydrates}
                <span className="text-xs ml-1">g</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[100px]">
            {product?.saltEquivalent ? (
              <>
                {product?.saltEquivalent}
                <span className="text-xs ml-1">g</span>
              </>
            ) : (
              "-"
            )}
          </td>
          <td className="w-[200px]">{product?.allergen ? product?.allergen : "-"}</td>
        </tr>
      </tbody>
    </table>
  );
}
