import Image from "next/image";

export default function Hero() {
  return (
    <>
      <Image src="/assets/hero2.jpg" width={1200} height={496} className="rounded-large" priority={true} alt="" />
    </>
  );
}
