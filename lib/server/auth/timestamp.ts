// /home/takashi_ogawa/shop-demo/lib/server/auth/timestamp.ts
import { toZonedTime, format } from "date-fns-tz";

// 日本時間の現在時刻を取得
export const getJstTimestamp = () => {
  //const now = new Date();
  //const jstDate = toZonedTime(new Date(), "Asia/Tokyo");
  return toZonedTime(new Date(), "Asia/Tokyo").toString();
};

// トークンの有効期限を JST に変換
export const getTokenExpiryInJst = (expiry: Date) => {
  return toZonedTime(new Date(expiry), "Asia/Tokyo").toString();
};
