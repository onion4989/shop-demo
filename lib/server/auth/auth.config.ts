import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { LoginSchema } from "@/schemas/Index";
import { getUserByEmail } from "./data/user";

const authConfig = {
  providers: [
    // TODO: Google,Github認証を追加する
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        try {
          if (validatedFields.success) {
            const { email, password } = validatedFields.data;

            const user = await getUserByEmail(email);
            if (!user || !user.password) return null;

            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) return user;
          }
        } catch (error) {
          console.error("認証処理中にエラーが発生しました:", error);
          throw new Error("Internal Server Error");
        }

        return null;
      },
    }),
  ],
};
