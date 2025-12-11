// /home/takashi_ogawa/shop-demo/lib/server/auth/mail.ts
import { Resend } from "resend";
import { requireEnv, getEnv } from "@/lib/env";

// メール送信機能を使用する場合、RESEND_API_KEYとEMAIL_FROMは必須
const resendApiKey = getEnv("RESEND_API_KEY");
const emailFrom = getEnv("EMAIL_FROM");

if (!resendApiKey || !emailFrom) {
  console.warn(
    "警告: RESEND_API_KEY または EMAIL_FROM が設定されていません。\n" +
    "メール送信機能は動作しません。"
  );
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

/*
  2段階認証
*/
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  if (!resend || !emailFrom) {
    throw new Error(
      "メール送信機能が設定されていません。RESEND_API_KEY と EMAIL_FROM を設定してください。"
    );
  }

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "2段階認証コード",
    html: `<p>2段階認証コード: ${token}</p>`,
  });
};

/*
  パスワードリセット
*/
export const sendPasswordResetEmail = async (email: string, token: string) => {
  // 環境変数からベースURLを取得（本番環境対応）
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const resetLink = `${baseUrl}/auth/new-password?token=${token}`;

  if (!resend || !emailFrom) {
    throw new Error(
      "メール送信機能が設定されていません。RESEND_API_KEY と EMAIL_FROM を設定してください。"
    );
  }

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "パスワードのリセット",
    html: `<p><a href="${resetLink}">こちら</a>からパスワードをリセット</p>`,
  });
};

/*
  登録（サインアップ）時確認メール
*/
export const sendVerificationEmail = async (email: string, token: string) => {
  // 環境変数からベースURLを取得（本番環境対応）
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const confirmLink = `${baseUrl}/auth/new-verification?token=${token}`;

  if (!resend || !emailFrom) {
    throw new Error(
      "メール送信機能が設定されていません。RESEND_API_KEY と EMAIL_FROM を設定してください。"
    );
  }

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "確認メール",
    html: `<p><a href="${confirmLink}">こちら</a>をクリック</p>`,
  });
};
