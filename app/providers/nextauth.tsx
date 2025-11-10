import NextAuth, { Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }: { account: Account | null; profile?: Profile | undefined }) {
      const isAccount = account && profile;
      if (isAccount && account.provider === "google") {
        // return profile.email_verified && profile.email.endsWith("@example.com")
        return true;
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
