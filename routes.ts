/**
 * 公開アクセスが可能なルートの配列。
 * これらのルートは認証を必要としません。
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/", "/auth/new-verification"];

/**
 * 認証に使用されるルートの配列。
 * これらのルートはログイン済みのユーザーを /settings にリダイレクトします。
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * API認証ルートのプレフィックス。
 * このプレフィックスで始まるルートはAPI認証のために使用されます。
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";
// http://localhost:3000/api/auth/provider

/**
 * （ユーザーが）ログインしている場合に、自動的にsettingsにリダイレクトします。
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
