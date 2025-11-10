// navi.tsx
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { AcmeLogo } from "./acmeLogo.jsx";
import Image from "next/image";

export default function Navigations() {
  return (
    <Navbar isBordered className="bg-[#FBC4C0] bg-opacity-50">
      <NavbarBrand>
        <AcmeLogo />
        <Link href="/">
          <p className="font-bold text-inherit">AI CAKE SHOP</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4">
        <NavbarItem>
          <Link href="/search" aria-current="page">
            商品一覧
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact">お問い合わせ</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex space-x-4">
          <FaSearch className="text-gray-600" size={20} />
          <FaShoppingCart className="text-gray-600" size={20} />
          <FaUser className="text-gray-600" size={20} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
