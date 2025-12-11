// /home/takashi_ogawa/shop-demo/app/auth/new-password/page.tsx
import { NewPasswordForm } from "@/components/auth/newPasswordForm";

type NewPasswordPageProps = {
  searchParams?: {
    token?: string;
  };
};

export default function NewPasswordPage({ searchParams }: NewPasswordPageProps) {
  const token = searchParams?.token ?? null;

  return <NewPasswordForm token={token} />;
}


