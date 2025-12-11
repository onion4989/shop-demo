// /home/takashi_ogawa/shop-demo/auth.config.ts

import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas/Index";
import { getUserByEmail } from "@/lib/server/auth/data/user";
import { getEnv } from "@/lib/env";

// ★ v5 では NextAuthConfig は存在しない
// import type { NextAuthConfig } from "next-auth"; ← 削除

import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// OAuthプロバイダーの設定（環境変数が存在する場合のみ有効化）
const providers = [];

// Google OAuth設定（環境変数が存在する場合のみ）
const googleClientId = getEnv("GOOGLE_CLIENT_ID");
const googleClientSecret = getEnv("GOOGLE_CLIENT_SECRET");
if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

// GitHub OAuth設定（環境変数が存在する場合のみ）
const githubClientId = getEnv("GITHUB_CLIENT_ID");
const githubClientSecret = getEnv("GITHUB_CLIENT_SECRET");
if (githubClientId && githubClientSecret) {
  providers.push(
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    })
  );
}

// NextAuth v5 で最も安全な書き方
const authConfig = {
  providers: [
    ...providers,
    Credentials({
      async authorize(credentials) {
        const validated = LoginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
};

export default authConfig;
