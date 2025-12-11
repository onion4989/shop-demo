// /home/takashi_ogawa/shop-demo/components/auth/newVerificationForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";

import { CardWrapper } from "@/components/auth/cardWrapper";
import { newVerification } from "@/lib/server/auth/actions/new-verification";
import { FormError } from "@/components/error";
import { FormSuccess } from "@/components/success";

type NewVerificationFormProps = {
  token?: string | null;
};

export const NewVerificationForm = ({ token }: NewVerificationFormProps) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  // Strict Mode でも 1 回しか実行されないようにするフラグ
  const hasRunRef = useRef(false);

  useEffect(() => {
    // すでに実行済みなら何もしない（Strict Mode の二重実行対策）
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // token が存在しない場合
    if (!token) {
      setError("トークンが見つかりません!");
      return;
    }

    const verify = async () => {
      try {
        const data = await newVerification(token);

        if (data.success) {
          setSuccess(data.success);
          setError(undefined);
        } else if (data.error) {
          setError(data.error);
          setSuccess(undefined);
        }
      } catch (e) {
        // エラーログを出力（開発環境のみ）
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.error(e);
        }
        setError("何かの問題が発生しました。");
      }
    };

    void verify();
  }, [token]);

  return (
    <CardWrapper
      headerLabel="認証を確認中"
      backButtonLabel="ログインへ戻る"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
