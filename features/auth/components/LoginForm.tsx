"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { signIn } from "@/node_modules/next-auth/react";

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string) || "";
    const password = (formData.get("password") as string) || "";

    try {
      // クライアント側から next-auth の signIn を呼ぶ（サーバー側に POST される）
      const res = await signIn("credentials", {
        redirect: false, // フロントで制御
        email,
        password,
      });

      // res は { ok: boolean, error?: string, status?: number, url?: string } など
      if (!res || !res.ok) {
        // next-auth が返すエラー文字列があれば表示
        const msg = (res && (res as any).error) ? (res as any).error : "Invalid credentials.";
        setErrorMessage(msg);
      } else {
        // 認証成功：必要ならリダイレクト
        // 例: window.location.href = "/dashboard";
        setErrorMessage(undefined);
        // ここでページ遷移したければ行う
        // window.location.href = "/"; 
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Log in"}
          </Button>
        </div>

        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </form>
  );
}
