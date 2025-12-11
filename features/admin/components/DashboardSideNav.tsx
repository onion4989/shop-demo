// app/ui/dashboard/sidenav.tsx

"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { AiFillProduct } from "react-icons/ai";

const links = [
  { name: "TOP", href: "/dashboard", icon: "icon" },
  { name: "製品一覧 / 変更 / 削除", href: "/dashboard/all", icon: "icon" },
  { name: "新規登録", href: "/dashboard/regist", icon: "icon" },
];

export default function SideNav() {
  const pathname = usePathname();
  console.log("pathname:" + pathname);
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            "flex h-[40px] grow items-center justify-center gap-2 p-1 text-sm text-white font-medium hover:bg-sky-100 hover:text-blue-600 rounded-md md:flex-none md:justify-start md:p-2 md:px-3",
            {
              "text-blue-600": pathname === link.href,
            }
          )}
        >
          <AiFillProduct />
          <p>{link.name}</p>
        </Link>
      ))}
    </>
  );
}
