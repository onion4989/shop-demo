// /home/takashi_ogawa/shop-demo/components/auth/registerForm.tsx
"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { CardWrapper } from "@/components/auth/cardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegisterSchema } from "@/schemas/Index";
import { FormError } from "@/components/error";
import { FormSuccess } from "@/components/success";
import { Register } from "@/lib/server/auth/actions/register";
import { BeatLoader } from "react-spinners";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    //console.log(values);
    setError("");
    setSuccess("");

    startTransition(() => {
      Register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="アカウント作成"
      backButtonLabel="すでにアカウントはお持ちですか？"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ユーザー名</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="ユーザー名" type="username" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="example@mail.com" type="email" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="******" type="password" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>確認用パスワード</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="******" type="password" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            
            {isPending ? (
              <BeatLoader size={8} />
            ) :(
              "アカウント作成"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
