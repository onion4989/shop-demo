// /lib/logger.ts
// ロギングユーティリティ - 開発環境でのみログを出力

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * 開発環境でのみログを出力する
 */
export const logger = {
  /**
   * 情報ログ（開発環境のみ）
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },

  /**
   * エラーログ（常に出力）
   */
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(...args);
  },

  /**
   * 警告ログ（開発環境のみ）
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },

  /**
   * デバッグログ（開発環境のみ）
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },
};

