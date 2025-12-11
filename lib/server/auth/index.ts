// /home/takashi_ogawa/shop-demo/lib/server/auth/index.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import type {
  Session,
  User,
  Account,
} from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";

import authConfig from "@/auth.config";
import { prisma } from "@/lib/server/prisma";
import { getUserById } from "@/lib/server/auth/data/user";
import { getTwoFactorConfirmationByUserId } from "@/lib/server/auth/data/towFactorConfirmation";


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = (NextAuth as any)({
  ...authConfig,

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  events: {
    async linkAccount({ user }: { user: User | AdapterUser }) {
      if (!user?.id) return;

      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: User | AdapterUser;
      account: Account | null;
    }) {
      // OAuth はメール確認なしで許可
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      // 2段階認証
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation =
          await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },

    async session({
      token,
      session,
    }: {
      token: JWT;
      session: Session;
    }) {
      // id を session.user に付与
      if (token.sub && session.user) {
        (session.user as any).id = token.sub;
      }

      // role を session.user に付与
      if ((token as any).role && session.user) {
        (session.user as any).role = (token as any).role;
      }

      return session;
    },

    async jwt({ token }: { token: JWT }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      return {
        ...token,
        role: user.role,
      };
    },
  },
});

