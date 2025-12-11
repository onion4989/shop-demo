// /home/takashi_ogawa/shop-demo/app/auth/login/page.tsx
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/loginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
