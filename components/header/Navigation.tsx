// components/header/Navigation.tsx
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link } from "@heroui/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Logo } from "./Logo";
import {Button, ButtonGroup} from "@heroui/button";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function Navigations() {
  return (
    <Navbar isBordered className="bg-[#FBC4C0] bg-opacity-50">
      <NavbarBrand>
        <Logo />
        <Link href="/">
          <p className="font-bold text-inherit">AI CAKE SHOP</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/catalog" aria-current="page">
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
