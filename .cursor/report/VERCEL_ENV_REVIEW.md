# Vercel環境変数レビュー結果

## 📋 現在設定されている環境変数

### ✅ 正しく設定されているもの

- `GITHUB_CLIENT_ID` ✅
- `GITHUB_CLIENT_SECRET` ✅
- `GOOGLE_CLIENT_ID` ✅
- `GOOGLE_CLIENT_SECRET` ✅
- `RESEND_API_KEY` ✅
- `POSTGRES_URL_NON_POOLING` ✅

---

## ❌ 不足している必須環境変数

### 🔴 必須（追加が必要）

1. **`POSTGRES_PRISMA_URL`** ⚠️ **重要**
   - Prismaが使用する接続プール用のURL
   - `POSTGRES_URL`とは異なります
   - **必須です！**

2. **`AUTH_SECRET`** ⚠️ **重要**
   - NextAuth v5で使用されるシークレットキー
   - `NEXTAUTH_SECRET`とは異なります
   - **必須です！**

3. **`EMAIL_FROM`** ⚠️ **重要**
   - メール送信元のアドレス（例: `noreply@yourdomain.com`）
   - Resendで認証済みのメールアドレスである必要があります
   - **必須です！**

---

## ⚠️ 設定されているが、名前が異なるもの

### `NEXTAUTH_SECRET` → `AUTH_SECRET` に変更推奨

- **現在**: `NEXTAUTH_SECRET`
- **推奨**: `AUTH_SECRET`
- **理由**: NextAuth v5では`AUTH_SECRET`を使用します
- **対応**: `AUTH_SECRET`を追加し、`NEXTAUTH_SECRET`は削除または残してもOK（後方互換性のため）

---

## ❓ 不要または重複している可能性があるもの

### データベース関連

以下の環境変数は、通常は**不要**です（`POSTGRES_PRISMA_URL`に含まれています）：

- `POSTGRES_URL` - Prismaでは使用されていません（`POSTGRES_PRISMA_URL`を使用）
- `POSTGRES_URL_NO_SSL` - 通常は不要
- `POSTGRES_USER` - URLに含まれているため不要
- `POSTGRES_PASSWORD` - URLに含まれているため不要
- `POSTGRES_HOST` - URLに含まれているため不要
- `POSTGRES_DATABASE` - URLに含まれているため不要

**注意**: もし他のツールやスクリプトで個別に使用している場合は、残しておいても問題ありません。

### NextAuth関連

- `NEXTAUTH_URL` - **オプション**（NextAuth v5では自動検出されるため、設定不要）

---

## 📝 推奨される対応

### 1. 必須環境変数を追加

Vercelダッシュボードで以下を追加してください：

```
POSTGRES_PRISMA_URL=postgresql://...
AUTH_SECRET=your-secret-key-here
EMAIL_FROM=noreply@yourdomain.com
```

### 2. `AUTH_SECRET`を追加

`NEXTAUTH_SECRET`の値と同じ値を`AUTH_SECRET`として追加してください。

### 3. 不要な環境変数の整理（オプション）

以下の環境変数は削除しても問題ありません（他の用途で使用していない場合）：

- `POSTGRES_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_DATABASE`
- `NEXTAUTH_URL`（自動検出されるため）

---

## 🔧 設定手順

### ステップ1: 必須環境変数を追加

1. Vercelダッシュボード → **Settings** → **Environment Variables**
2. 以下を追加：

   **`POSTGRES_PRISMA_URL`**
   - Key: `POSTGRES_PRISMA_URL`
   - Value: データベース接続プール用のURL（通常は`POSTGRES_URL`と同じ値でOK）
   - Environment: Production, Preview

   **`AUTH_SECRET`**
   - Key: `AUTH_SECRET`
   - Value: `NEXTAUTH_SECRET`と同じ値（または新しく生成）
   - Environment: Production, Preview
   - **生成方法**: `openssl rand -base64 32`

   **`EMAIL_FROM`**
   - Key: `EMAIL_FROM`
   - Value: Resendで認証済みのメールアドレス（例: `noreply@yourdomain.com`）
   - Environment: Production, Preview

### ステップ2: 再デプロイ

環境変数を追加した後、必ず**再デプロイ**を実行してください。

---

## ✅ 最終的な環境変数リスト（推奨）

### 必須

```
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
AUTH_SECRET=your-secret-key-here
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

### OAuth（使用する場合のみ）

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### オプション

```
NEXTAUTH_URL=https://your-app.vercel.app（自動検出されるため不要）
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app（必要に応じて）
```

---

## 🚨 緊急度別対応

### 🔴 最優先（即座に対応）

1. `POSTGRES_PRISMA_URL` を追加
2. `AUTH_SECRET` を追加
3. `EMAIL_FROM` を追加

これらがないと、アプリケーションが正常に動作しません。

### 🟡 推奨（できるだけ早く対応）

- `NEXTAUTH_SECRET` → `AUTH_SECRET` に移行

### 🟢 オプション（時間があるときに）

- 不要な環境変数の整理

---

## 📚 参考情報

- Prismaでは`POSTGRES_PRISMA_URL`と`POSTGRES_URL_NON_POOLING`の2つが必要です
- NextAuth v5では`AUTH_SECRET`を使用します（`NEXTAUTH_SECRET`は後方互換性のため残してもOK）
- `EMAIL_FROM`はResendで認証済みのメールアドレスである必要があります

---

**作成日:** 2024年  
**最終更新:** 2024年

