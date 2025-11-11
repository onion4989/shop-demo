// app/components/detail/detail-info.tsx
import Image from "next/image";
import { getProductDetailCached } from "@/app/lib/data";

export default async function ProductDetailInfo(params: { productid: string }) {
  const product = await getProductDetailCached(params.productid);

  const hasImages = product?.images.some((item) =>
    [item.imageUrl_1, item.imageUrl_2, item.imageUrl_3, item.imageUrl_4, item.imageUrl_5, item.imageUrl_6].some(
      (url) => url !== null
    )
  );

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <Image
            src={`/assets/${product?.images[0].thumbnailUrl}`}
            width={384}
            height={320}
            alt={`${product?.name}`}
            style={{ width: "auto", height: "auto" }}
            className="rounded-large object-cover"
            priority={true}
          />
        </div>
        <div className="col-span-9">
          <h2 className="text-2xl font-bold">{product?.name}</h2>
          <p className=" my-3">
            <span className="text-3xl">{product?.price}</span>
            <span className="text-base ml-1">円</span>
            <span className="text-sm">（税込）</span>
          </p>
          <p>{product?.description}</p>
        </div>
      </div>
      {hasImages && (
        <div className="grid grid-cols-6 bg-gray-100 rounded-2xl my-6 p-4">
          {product?.images.map((item, index) =>
            // Create an array of image URLs and filter out null values
            [item.imageUrl_1, item.imageUrl_2, item.imageUrl_3, item.imageUrl_4, item.imageUrl_5, item.imageUrl_6]
              .filter(Boolean)
              .map((url, i) => (
                <Image
                  key={`${index}-${i}`}
                  src={`/assets/${url}`}
                  width={160}
                  height={160}
                  alt={`${product?.name}`}
                  style={{ width: "160px", height: "160px" }}
                  className="rounded-large object-cover"
                  priority={false}
                />
              ))
          )}
        </div>
      )}
    </>
  );
}
