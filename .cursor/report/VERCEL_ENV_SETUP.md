# Vercel環境変数設定ガイド

## 📌 重要なポイント

**`.env`ファイルはローカル開発環境でのみ使用されます。Vercelなどの本番環境では使用されません。**

---

## 🔍 なぜVercel側でも設定が必要なのか？

### 1. `.env`ファイルはGitにコミットされない

`.env`ファイルは通常、`.gitignore`に含まれているため：
- ✅ ローカル開発環境でのみ使用される
- ❌ Gitリポジトリにコミットされない
- ❌ Vercelに自動的に反映されない

### 2. セキュリティ上の理由

環境変数には機密情報（APIキー、シークレットなど）が含まれるため：
- `.env`ファイルをGitにコミットすると、機密情報が漏洩するリスクがある
- Vercelの環境変数設定は、暗号化されて安全に管理される

### 3. 環境ごとの設定が必要

- **ローカル開発環境**: `.env.local` または `.env`
- **Vercel本番環境**: Vercelダッシュボードで設定
- **Vercelプレビュー環境**: Vercelダッシュボードで設定（必要に応じて）

---

## 📋 Vercelで設定すべき環境変数一覧

### 必須環境変数

以下の環境変数は、アプリケーションが動作するために**必須**です：

```bash
# データベース接続
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...

# NextAuth設定
AUTH_SECRET=your-secret-key-here

# メール送信（Resend）
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

### オプション環境変数

以下の環境変数は、該当機能を使用する場合のみ設定してください：

```bash
# アプリケーションURL（オプション）
# VERCEL_URLは自動設定されるため、通常は不要
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Google OAuth（使用する場合のみ）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth（使用する場合のみ）
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## 🚀 Vercelでの環境変数設定手順

### ステップ1: Vercelダッシュボードにアクセス

1. https://vercel.com/dashboard にログイン
2. 対象のプロジェクトを選択

### ステップ2: 環境変数設定画面を開く

1. 左サイドバーから「**Settings**」をクリック
2. 「**Environment Variables**」をクリック

### ステップ3: 環境変数を追加

1. 「**Add New**」ボタンをクリック
2. 以下の情報を入力：
   - **Key**: 環境変数名（例: `GOOGLE_CLIENT_ID`）
   - **Value**: 環境変数の値（`.env`ファイルからコピー）
   - **Environment**: 適用環境を選択
     - ✅ **Production**: 本番環境
     - ✅ **Preview**: プレビュー環境（プルリクエストなど）
     - ✅ **Development**: 開発環境（通常は不要）
3. 「**Save**」をクリック

### ステップ4: すべての環境変数を追加

`.env`ファイルに記載されているすべての環境変数を、上記の手順で追加してください。

### ステップ5: 再デプロイ

環境変数を追加・変更した後は、**再デプロイが必要**です：

1. 「**Deployments**」タブをクリック
2. 最新のデプロイを選択
3. 「**Redeploy**」ボタンをクリック
4. 「**Redeploy**」を確認

---

## 🔄 `.env`ファイルからVercelへの移行チェックリスト

以下のチェックリストを使用して、すべての環境変数が設定されているか確認してください：

### データベース関連
- [ ] `POSTGRES_PRISMA_URL`
- [ ] `POSTGRES_URL_NON_POOLING`

### NextAuth関連
- [ ] `AUTH_SECRET`

### メール送信関連
- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM`

### OAuth関連（使用する場合）
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GITHUB_CLIENT_ID`
- [ ] `GITHUB_CLIENT_SECRET`

### その他
- [ ] `NEXT_PUBLIC_APP_URL`（必要に応じて）

---

## 💡 便利なTips

### 1. 環境変数の一括確認

Vercel CLIを使用して、設定済みの環境変数を確認できます：

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# ログイン
vercel login

# 環境変数を確認
vercel env ls
```

### 2. `.env.example`ファイルの作成

`.env`ファイルのテンプレートを作成し、Gitにコミットしておくと便利です：

```bash
# .env.example
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
AUTH_SECRET=your-secret-key-here
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

このファイルは機密情報を含まないため、Gitにコミットしても安全です。

### 3. 環境変数の検証

アプリケーション起動時に環境変数が正しく設定されているか確認するには、`lib/env.ts`の`validateRequiredEnvVars()`関数を使用できます。

---

## ⚠️ よくある問題と解決方法

### 問題1: 環境変数が設定されているのに動作しない

**原因:**
- 再デプロイしていない
- 環境変数名にタイポがある
- 環境変数の値に余分なスペースや改行が含まれている

**解決方法:**
1. 再デプロイを実行
2. 環境変数名を再確認
3. 環境変数の値を再入力（コピー&ペースト時は注意）

### 問題2: OAuth認証が動作しない

**原因:**
- OAuthプロバイダーの設定でリダイレクトURLが正しく設定されていない

**解決方法:**
1. Google/GitHubのOAuth設定画面で、リダイレクトURLを確認
2. VercelのURLを追加（例: `https://your-app.vercel.app/api/auth/callback/google`）

### 問題3: メール送信が動作しない

**原因:**
- `RESEND_API_KEY`または`EMAIL_FROM`が設定されていない
- ResendのAPIキーが無効

**解決方法:**
1. 環境変数が正しく設定されているか確認
2. ResendのダッシュボードでAPIキーを確認
3. `EMAIL_FROM`のメールアドレスがResendで認証されているか確認

---

## 📚 参考リンク

- [Vercel環境変数のドキュメント](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js環境変数のドキュメント](https://nextjs.org/docs/basic-features/environment-variables)
- [Resendドキュメント](https://resend.com/docs)

---

## ✅ 確認事項

Vercelにデプロイする前に、以下を確認してください：

1. ✅ すべての必須環境変数がVercelに設定されている
2. ✅ OAuthプロバイダーのリダイレクトURLが正しく設定されている
3. ✅ 環境変数を追加・変更した後、再デプロイを実行した
4. ✅ 本番環境でアプリケーションが正常に動作することを確認した

---

**作成日:** 2024年  
**最終更新:** 2024年

