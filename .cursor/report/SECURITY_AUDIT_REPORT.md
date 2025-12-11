# セキュリティ監査レポート

## 監査日: 2024年
## 対象プロジェクト: shop-demo

---

## 1. セキュリティ脆弱性

### ✅ 修正済み: トークンの有効期限が間違っている

**ファイル:** `lib/server/auth/tokens.ts`  
**該当行:** 52, 85

**問題:**
```typescript
const expires = new Date(new Date().getTime() + 3600 * 100);
```
`3600 * 100` は 360,000 ミリ秒 = 100時間（約4日）になります。意図は1時間（3600秒）のはずです。

**修正内容:**
```typescript
// 1時間 = 3600秒 = 3,600,000ミリ秒
const expires = new Date(new Date().getTime() + 3600 * 1000);
```

**影響:** パスワードリセットトークンとメール確認トークンの有効期限が長すぎるため、セキュリティリスクが高まっていましたが、修正済みです。

---

### ✅ 修正済み: パスワードリセット/確認メールのリンクが localhost にハードコード

**ファイル:** `lib/server/auth/mail.ts`  
**該当行:** 22, 36

**問題:**
```typescript
const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
```

**修正内容:**
```typescript
// 環境変数からベースURLを取得（本番環境対応）
const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const resetLink = `${baseUrl}/auth/new-password?token=${token}`;
const confirmLink = `${baseUrl}/auth/new-verification?token=${token}`;
```

**影響:** 本番環境でメールリンクが機能しない問題は修正済みです。

---

### ✅ 修正済み: APIルートに認証チェックがない

**ファイル:** 
- `app/api/admin/products/route.ts` ✅ 修正済み
- `app/api/search/route.ts` (公開APIのため認証不要)
- `app/api/categories/route.ts` (公開APIのため認証不要)
- `app/api/hit/route.ts` (公開APIのため認証不要)

**問題:** 管理画面用のAPI（`/api/admin/products`）に認証チェックがありませんでした。誰でも商品情報を取得・操作できる可能性がありました。

**修正内容:**
```typescript
// app/api/admin/products/route.ts
import { auth } from "@/lib/server/auth";

export async function POST(req: Request) {
  // 認証チェック
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // ... 既存のコード
}
```

**影響:** 未認証ユーザーが管理機能にアクセスできる問題は修正済みです。  
**注意:** `/api/search`, `/api/categories`, `/api/hit` は公開APIのため、認証不要と判断しました。必要に応じて追加の認証を検討してください。

---

### 🟡 中: 環境変数の検証不足

**ファイル:** 
- `auth.config.ts` (18-23行目)
- `lib/server/auth/mail.ts` (4, 11, 25, 39行目)

**問題:** 環境変数が `undefined` の場合、アプリケーションが予期しない動作をする可能性があります。

**修正案:**
```typescript
// auth.config.ts
const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// または、起動時に検証する関数を作成
```

**影響:** 本番環境で環境変数が設定されていない場合、アプリケーションがクラッシュする可能性があります。

---

### ✅ 修正済み: ログに機密情報が含まれる可能性

**ファイル:** `lib/server/auth/actions/login.ts`  
**該当行:** 42-48

**問題:**
```typescript
console.log("[Login action] existingUser:", {
  id: existingUser?.id,
  email: existingUser?.email,
  password: existingUser?.password?.slice(0, 20) + "...",
  // ...
});
```

**修正内容:**
```typescript
// パスワード情報はログに出力しない
console.log("[Login action] existingUser:", {
  id: existingUser?.id,
  email: existingUser?.email,
  // セキュリティ: パスワード情報はログに出力しない
  isTwoFactorEnabled: existingUser?.isTwoFactorEnabled,
  emailVerified: existingUser?.emailVerified,
});
```

**影響:** ログファイルにパスワードの一部が残る可能性がありましたが、修正済みです。

---

### ✅ 修正済み: PrismaClient のインスタンスが複数作成されている

**ファイル:**
- `app/api/search/route.ts` ✅ 修正済み
- `app/api/categories/route.ts` ✅ 修正済み
- `app/api/hit/route.ts` ✅ 修正済み

**問題:**
```typescript
const prisma = new PrismaClient();
```

各APIルートで新しいPrismaClientインスタンスを作成していました。`lib/server/prisma.ts` でシングルトンパターンが実装されているのに、使用されていませんでした。

**修正内容:**
```typescript
// app/api/search/route.ts
import { prisma } from "@/lib/server/prisma";

// 既存の const prisma = new PrismaClient(); を削除
```

**影響:** メモリリークや接続プールの無駄な消費の可能性がありましたが、修正済みです。

---

## 2. バグの可能性

### ✅ 修正済み: 商品ID生成時の競合状態

**ファイル:** `lib/server/admin/actions/registerProduct.ts`  
**該当行:** 13-31

**問題:**
```typescript
async function generateNextProductId(categoryId: string): Promise<string> {
  const lastProduct = await prisma.product.findFirst({
    where: { categoryId },
    orderBy: { productId: "desc" },
    select: { productId: true },
  });
  // ...
}
```

同時に複数のリクエストが来た場合、同じIDが生成される可能性がありました。

**修正内容:**
```typescript
// トランザクションを使用して、ID生成から商品作成までをアトミックに実行
const result = await prisma.$transaction(async (tx) => {
  // ID生成と商品作成を同一トランザクション内で実行
  // productId が unique 制約なので、重複時はエラーになる
  // ...
});
```

**影響:** 同じ商品IDが生成され、データ整合性の問題が発生する可能性がありましたが、修正済みです。

---

### 🟡 中: エラーハンドリングが不十分

**ファイル:** 複数ファイル

**問題:** 多くの場所で `try-catch` で `null` を返すだけで、エラーの詳細がログに記録されません。

**例:**
```typescript
// lib/server/auth/data/user.ts
export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null; // エラーの詳細が失われる
  }
};
```

**修正案:**
```typescript
export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("[getUserByEmail] error:", error);
    // 本番環境では適切なエラーロギングサービスを使用
    return null;
  }
};
```

**影響:** デバッグが困難になり、本番環境での問題追跡が難しくなります。

---

### 🟡 中: 型安全性の問題

**ファイル:** 複数ファイル

**問題:** `any` 型が多用されています。

**例:**
- `middleware.ts` (7行目): `auth: any`
- `app/api/admin/products/route.ts` (20行目): `where: any`
- `app/api/search/route.ts` (22行目): `where: any`

**修正案:**
```typescript
// Prisma の型を活用
import { Prisma } from "@prisma/client";

const where: Prisma.ProductWhereInput = {
  // ...
};
```

**影響:** 型安全性が損なわれ、実行時エラーのリスクが高まります。

---

### 🟡 中: パスワードの最小長が短い

**ファイル:** `schemas/Index.ts`  
**該当行:** 8, 19, 33

**問題:**
```typescript
password: z.string().min(1, "パスワードは必須です。").min(6, "6文字以上必須。"),
```

6文字は短すぎます。セキュリティベストプラクティスでは最低8文字以上が推奨されます。

**修正案:**
```typescript
password: z.string()
  .min(1, "パスワードは必須です。")
  .min(8, "パスワードは8文字以上で入力してください。")
  .regex(/[A-Z]/, "大文字を含めてください。")
  .regex(/[a-z]/, "小文字を含めてください。")
  .regex(/[0-9]/, "数字を含めてください。");
```

**影響:** 弱いパスワードが許可され、ブルートフォース攻撃のリスクが高まります。

---

### 🟢 低: 不要な console.log が残っている

**ファイル:** 複数ファイル

**問題:** 本番環境に不要な `console.log` が残っています。

**該当ファイル:**
- `lib/server/auth/actions/login.ts` (29, 42行目)
- `features/admin/components/AdminOptions.tsx` (24行目)
- `features/admin/components/DashboardSideNav.tsx` (18行目)
- `components/auth/loginForm.tsx` (50行目)
- `components/auth/resetForm.tsx` (33行目)
- `app/(main)/catalog/[productId]/page.tsx` (11-13行目)
- `features/catalog/components/ProductDetailInfo.tsx` (12, 16, 18, 24行目)

**修正案:**
- 開発環境でのみログを出力するようにする
- または、適切なロギングライブラリ（例: `pino`, `winston`）を使用する

**影響:** 本番環境のログが肥大化し、パフォーマンスに影響する可能性があります。

---

## 3. パフォーマンス

### 🟡 中: N+1問題の可能性

**ファイル:** `app/api/search/route.ts`  
**該当行:** 34-48

**問題:** 大量の商品を取得する際、`category` と `images` のリレーションが含まれていますが、ページネーションがないため、大量データを一度に取得する可能性があります。

**修正案:**
```typescript
const [products, total] = await prisma.$transaction([
  prisma.product.findMany({
    where,
    orderBy: { recommend: "asc" },
    select: {
      productId: true,
      name: true,
      price: true,
      category: { select: { name: true } },
      images: { select: { thumbnailUrl: true }, take: 1 },
      option: true,
    },
    take: 50, // ページネーションを追加
    skip: (page - 1) * 50,
  }),
  prisma.product.count({ where }),
]);
```

**影響:** 大量のデータを一度に取得すると、メモリ使用量が増加し、レスポンス時間が長くなります。

---

### 🟡 中: 検索APIで全件取得の可能性

**ファイル:** `app/api/search/route.ts`  
**該当行:** 33-48

**問題:** `where` が空の場合、全商品を取得します。コメントには「全件」と書かれていますが、ページネーションがありません。

**修正案:**
上記のページネーション実装を追加してください。

---

## 4. Next.jsベストプラクティス

### 🟡 中: サーバーアクションの誤用

**ファイル:** `lib/server/actions.ts`  
**該当行:** 3, 22

**問題:**
```typescript
import { signIn } from "@/node_modules/next-auth/react";
```

`next-auth/react` の `signIn` はクライアントコンポーネント用です。サーバーアクションでは `@/lib/server/auth` からインポートすべきです。

**修正案:**
```typescript
import { signIn } from "@/lib/server/auth";
```

**影響:** このファイルが使用されている場合、正しく動作しない可能性があります。

---

### 🟢 低: クライアントコンポーネントで不要なログ

**ファイル:** 複数のクライアントコンポーネント

**問題:** クライアントコンポーネントで `console.log` が多用されています。これらはブラウザのコンソールに出力されます。

**修正案:**
開発環境でのみログを出力するか、適切なロギングライブラリを使用してください。

---

## 推奨される修正の優先順位

### 最優先（即座に修正）✅ 修正済み
1. ✅ **修正済み** トークンの有効期限の修正（`lib/server/auth/tokens.ts`）
2. ✅ **修正済み** APIルートへの認証チェック追加（`app/api/admin/products/route.ts`）
3. ✅ **修正済み** パスワードリセット/確認メールのリンク修正（`lib/server/auth/mail.ts`）

### 高優先度（できるだけ早く修正）✅ 一部修正済み
4. ✅ **修正済み** 商品ID生成時の競合状態の修正（`lib/server/admin/actions/registerProduct.ts`）
5. ✅ **修正済み** PrismaClient インスタンスの統一（`app/api/search/route.ts` など）
6. ⚠️ **未修正** 環境変数の検証追加

### 中優先度（計画的な修正）
7. ✅ エラーハンドリングの改善
8. ✅ 型安全性の向上（`any` 型の削減）
9. ✅ パスワードの最小長と複雑さの要件強化
10. ✅ ページネーションの実装

### 低優先度（リファクタリング時に対応）
11. ✅ 不要な `console.log` の削除
12. ✅ ログに機密情報が含まれないようにする

---

## まとめ

全体的に、プロジェクトは適切なセキュリティ対策（Zodバリデーション、bcrypt、NextAuth）を実装していますが、いくつかの重要な問題点が見つかりました。特に、トークンの有効期限、API認証、メールリンクのハードコードは即座に修正する必要がありました。

### 修正済み項目

以下の重要な問題は修正済みです：

1. ✅ **トークンの有効期限の修正** - 100時間から1時間に修正
2. ✅ **APIルートへの認証チェック追加** - `/api/admin/products` に認証を追加
3. ✅ **メールリンクのハードコード修正** - 環境変数からベースURLを取得するように変更
4. ✅ **商品ID生成時の競合状態の修正** - トランザクションを使用してアトミックに実行
5. ✅ **PrismaClient インスタンスの統一** - シングルトンパターンを使用
6. ✅ **ログから機密情報の削除** - パスワード情報をログに出力しないように修正

### 残りの推奨事項

以下の項目は今後対応することをお勧めします：

- 環境変数の検証追加
- エラーハンドリングの改善
- 型安全性の向上（`any` 型の削減）
- パスワードの最小長と複雑さの要件強化
- ページネーションの実装
- 不要な `console.log` の削除

監査を実施した後、これらの問題を修正しました。本番環境にデプロイする前に、再度テストを行うことをお勧めします。

