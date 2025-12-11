import Image from "next/image";
import Link from "next/link";

const category_class =
  "absolute top-2 right-2 flex items-center justify-center text-xs text-white font-bold bg-[#72BFA3] rounded-full py-1 px-4";

export default function ProductDesignCard({
  id,
  productid,
  name,
  category,
  price,
  img,
}: {
  id: number;
  productid: string;
  name: string;
  category: string;
  price: number;
  img: string;
}) {
  return (
    <Link href={`/catalog/${productid}`} className="relative w-full max-h-[180px]">
      <div className={`${category_class}`}>{category}</div>
      <div className="absolute left-2 top-2 text-6xl text-white font-bold opacity-25 z-50">{id}</div>
      <div className="absolute inset-x-0 bottom-2 h-[70px] bg-background/80 rounded-small mx-2 py-2 px-4">
        <h2 className="text-xs font-bold">{name}</h2>
        <p>{price}円</p>
      </div>
      <Image
        src={`/assets/${img}`}
        width={180}
        height={180}
        className="rounded-large w-[180px] h-[180px]"
        alt={`${name}`}
        priority={false}
      />
    </Link>
  );
}
