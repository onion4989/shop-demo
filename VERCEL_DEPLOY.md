# Vercelデプロイ手順

## 1. Vercelアカウントの準備

1. [Vercel](https://vercel.com)にアクセスしてアカウントを作成（GitHubアカウントでログイン推奨）

## 2. GitHubリポジトリにプッシュ

```bash
# Gitリポジトリが初期化されていない場合
cd /home/takashi_ogawa/shop-demo
git init
git add .
git commit -m "Initial commit"

# GitHubにリポジトリを作成後
git remote add origin https://github.com/YOUR_USERNAME/shop-demo.git
git branch -M main
git push -u origin main
```

## 3. Vercelでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択
4. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (デフォルト)
   - **Build Command**: `npm run vercel-build` (自動検出されるはず)
   - **Output Directory**: `.next` (自動検出されるはず)
   - **Install Command**: `npm install` (自動検出されるはず)

## 4. 環境変数の設定

Vercelダッシュボードの「Settings」→「Environment Variables」で以下を設定：

### 必須環境変数

```
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_direct_url
AUTH_SECRET=your_auth_secret_key
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email@example.com
```

### オプション環境変数（OAuthを使用する場合）

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 環境変数の取得方法

#### AUTH_SECRET
```bash
# ターミナルで実行
openssl rand -base64 32
```

#### PostgreSQL (Vercel Postgres)
1. Vercelダッシュボードで「Storage」→「Create Database」→「Postgres」を選択
2. データベースを作成後、「.env.local」タブで接続文字列を確認
3. `POSTGRES_PRISMA_URL` と `POSTGRES_URL_NON_POOLING` をコピー

#### Resend API Key
1. [Resend](https://resend.com)にアカウントを作成
2. API KeysセクションでAPIキーを作成
3. `RESEND_API_KEY` に設定
4. `EMAIL_FROM` に送信元メールアドレスを設定（例: `noreply@yourdomain.com`）

## 5. データベースのマイグレーション

Vercelデプロイ後、データベースのマイグレーションを実行：

### 方法1: Vercel CLIを使用（推奨）

```bash
# Vercel CLIをインストール
npm i -g vercel

# Vercelにログイン
vercel login

# プロジェクトにリンク
cd /home/takashi_ogawa/shop-demo
vercel link

# マイグレーションを実行
npx prisma migrate deploy
```

### 方法2: Vercelダッシュボードから実行

1. Vercelダッシュボードでプロジェクトを開く
2. 「Deployments」タブを開く
3. 最新のデプロイメントを選択
4. 「Functions」タブで実行環境を確認
5. 必要に応じて「Run Command」でマイグレーションを実行

## 6. デプロイ

1. Vercelダッシュボードで「Deploy」をクリック
2. デプロイが完了するまで待機（通常2-5分）
3. デプロイ完了後、提供されたURLでアクセス

## 7. カスタムドメインの設定（オプション）

1. Vercelダッシュボードで「Settings」→「Domains」
2. ドメインを追加
3. DNS設定を更新

## トラブルシューティング

### ビルドエラーが発生する場合

1. 「Deployments」タブでビルドログを確認
2. 環境変数が正しく設定されているか確認
3. `package.json`の`vercel-build`スクリプトを確認

### データベース接続エラーが発生する場合

1. `POSTGRES_PRISMA_URL` と `POSTGRES_URL_NON_POOLING` が正しく設定されているか確認
2. Vercel Postgresの接続文字列を再確認
3. データベースのマイグレーションが実行されているか確認

### 認証エラーが発生する場合

1. `AUTH_SECRET`が設定されているか確認
2. `NEXTAUTH_URL`が設定されているか確認（必要に応じて）
3. OAuthプロバイダーの設定を確認

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth.js Documentation](https://next-auth.js.org/)

