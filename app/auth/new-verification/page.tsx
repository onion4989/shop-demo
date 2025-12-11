// /home/takashi_ogawa/shop-demo/app/auth/new-verification/page.tsx
import { NewVerificationForm } from "@/components/auth/newVerificationForm";

type NewVerificationPageProps = {
  searchParams?: {
    token?: string;
  };
};

export default function NewVerificationPage({ searchParams }: NewVerificationPageProps) {
  const token = searchParams?.token ?? null;

  return (
    <div>
      <NewVerificationForm token={token} />
    </div>
  );
}
