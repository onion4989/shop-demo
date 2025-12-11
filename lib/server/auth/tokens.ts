// /home/takashi_ogawa/shop-demo/lib/server/auth/tokens.ts
import crypto from "crypto";

import { prisma } from "@/lib/server/prisma";
import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "@/lib/server/auth/data/verificationToken";
import { getPasswordRestTokenByEmail } from "@/lib/server/auth/data/passwordResetToken";

import { getTwoFactorTokenbyEmail } from "@/lib/server/auth/data/twoFactorToken";

/**
 **  2段階認証トークン生成
 **/
export const generateTwoFactorToken = async (email: string) => {
  // 認証番号生成
  const token = crypto.randomInt(100_000, 1_000_000).toString();

  // トークンの有効期限設定
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // データは存在するか？
  const existingToken = await getTwoFactorTokenbyEmail(email);

  // 既存トークンの削除
  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // 新しいトークンを保存
  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

/**
 **  パスワードリセット トークン生成＆削除
 **/
export const generatePasswordRestToken = async (email: string) => {
  // UUID形式のトークン生成
  const token = uuidv4();
  // トークンの有効期限設定（1時間 = 3600秒 = 3,600,000ミリ秒）
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  // 既存トークンは存在するか？
  const existingToken = await getPasswordRestTokenByEmail(email);

  // 既存トークンの削除
  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // 新しいトークンを保存
  const verificationToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

/**
 **  確認メール トークン生成＆削除
 **/
export const generateVerificationToken = async (email: string) => {
  // UUID形式のトークン生成
  const token = uuidv4();

  // トークンの有効期限設定（1時間 = 3600秒 = 3,600,000ミリ秒）
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // 既存トークンは存在するか？
  const existingToken = await getVerificationTokenByEmail(email);

  // 既存のトークンを削除:
  /*ユーザーが以前に未使用のトークンを持っている場合、
  その古いトークンは削除される。これにより、1ユーザーが同時に持つトークン
  を1つに制限し、不正利用を防ぐ。*/
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        token: existingToken.token,
      },
    });
  }

  // 新しいトークンを保存
  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
};
