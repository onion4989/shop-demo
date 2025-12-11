"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirent";
  asChild?: boolean;
}

export const LoginButton = ({ children, mode = "redirent", asChild }: LoginButtonProps) => {
  const router = useRouter();

  const onClickButton = () => {
    router.push("auth/login");
  };

  if (mode === "modal") {
    return <span>TODO: Implement modal</span>;
  }

  return (
    <span onClick={onClickButton} className="cursor-pointer">
      {children}
    </span>
  );
};

// export { LoginButton };
