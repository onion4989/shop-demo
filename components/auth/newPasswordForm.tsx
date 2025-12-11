// /home/takashi_ogawa/shop-demo/components/auth/newPasswordForm.tsx
"use client";

import * as z from "zod";
import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/schemas/Index";
import { newPassword } from "@/lib/server/auth/actions/new-password";

import { CardWrapper } from "@/components/auth/cardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/error";
import { FormSuccess } from "@/components/success";

type NewPasswordFormProps = {
  token: string | null;
};

export const NewPasswordForm = ({ token }: NewPasswordFormProps) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    // token がない場合はここで弾く
    if (!token) {
      setError("トークンが見つかりません!");
      return;
    }

    startTransition(async () => {
      const data = await newPassword(values, token);

      if (data?.error) {
        setError(data.error);
        return;
      }

      if (data?.success) {
        setSuccess(data.success);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="新しいパスワードを入力してください。"
      backButtonLabel="ログインに戻る"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>新しいパスワード</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="******"
                    type="password"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? "送信中..." : "パスワードをリセット"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
