# NEXTAUTH_URL 設定ガイド

## 📌 重要なポイント

**NextAuth v5では、`NEXTAUTH_URL`は通常不要です。自動的に検出されます。**

---

## 🔍 NextAuth v5での変更点

### NextAuth v4 vs v5

| バージョン | 環境変数 | 説明 |
|-----------|---------|------|
| **v4** | `NEXTAUTH_URL` | 必須（手動設定が必要） |
| **v5** | `AUTH_URL` または自動検出 | 通常は不要（自動検出） |

### あなたのプロジェクトの状況

- ✅ NextAuth v5を使用（`next-auth": "^5.0.0-beta.20"`）
- ✅ コード内で`NEXTAUTH_URL`を直接使用していない
- ✅ Vercelでは`VERCEL_URL`が自動設定される

---

## 💡 推奨される設定

### オプション1: 環境変数を設定しない（推奨）

NextAuth v5では、以下の順序で自動的にURLを検出します：

1. `AUTH_URL` 環境変数（設定されている場合）
2. `VERCEL_URL` 環境変数（Vercelで自動設定）
3. `NEXTAUTH_URL` 環境変数（v4互換性のため）
4. リクエストヘッダーから自動検出

**推奨:** 何も設定せず、自動検出に任せる

### オプション2: `AUTH_URL`を設定する（明示的に設定したい場合）

NextAuth v5では、`AUTH_URL`を使用することを推奨しています：

**ローカル開発環境（`.env.local`）:**
```bash
AUTH_URL=http://localhost:3000
```

**Vercel本番環境:**
```bash
AUTH_URL=https://your-app.vercel.app
```

### オプション3: `NEXTAUTH_URL`を設定する（v4互換性のため）

既存の`.env`ファイルに`NEXTAUTH_URL`が設定されている場合：

**ローカル開発環境（`.env.local`）:**
```bash
NEXTAUTH_URL=http://localhost:3000
```

**Vercel本番環境:**
```bash
NEXTAUTH_URL=https://your-app.vercel.app
```

---

## ⚠️ 重要な注意事項

### OAuthプロバイダーのリダイレクトURL設定

`NEXTAUTH_URL`や`AUTH_URL`の設定とは別に、**OAuthプロバイダー（Google、GitHub）の設定でリダイレクトURLを正しく設定する必要があります。**

#### Google OAuth設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを選択
3. 「認証情報」→ OAuth 2.0 クライアント ID を選択
4. 「承認済みのリダイレクト URI」に以下を追加：
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

#### GitHub OAuth設定

1. [GitHub Developer Settings](https://github.com/settings/developers)にアクセス
2. OAuth Appを選択
3. 「Authorization callback URL」を設定：
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```

---

## 🚀 Vercelでの設定方法

### 推奨: 何も設定しない

NextAuth v5では、Vercelが自動的に`VERCEL_URL`を設定するため、追加の設定は不要です。

### 明示的に設定する場合

もし明示的に設定したい場合は、Vercelダッシュボードで以下を設定：

1. **Settings** → **Environment Variables**
2. **Add New** をクリック
3. 以下を設定：
   - **Key**: `AUTH_URL`（または`NEXTAUTH_URL`）
   - **Value**: `https://your-app.vercel.app`
   - **Environment**: Production, Preview を選択
4. **Save** をクリック
5. **再デプロイ**を実行

---

## 📋 チェックリスト

### ローカル開発環境

- [ ] `.env.local`に`AUTH_URL=http://localhost:3000`を設定（オプション）
- [ ] または何も設定せず、自動検出に任せる

### Vercel本番環境

- [ ] 何も設定せず、自動検出に任せる（推奨）
- [ ] または`AUTH_URL=https://your-app.vercel.app`を設定（明示的に設定したい場合）

### OAuthプロバイダー設定

- [ ] Google OAuthのリダイレクトURLに本番環境のURLを追加
- [ ] GitHub OAuthのリダイレクトURLに本番環境のURLを追加

---

## 🔧 トラブルシューティング

### 問題: OAuth認証が動作しない

**原因:**
- OAuthプロバイダーのリダイレクトURLが正しく設定されていない
- 本番環境のURLがリダイレクトURLに含まれていない

**解決方法:**
1. Google/GitHubのOAuth設定画面でリダイレクトURLを確認
2. 本番環境のURL（`https://your-app.vercel.app/api/auth/callback/google`など）を追加

### 問題: 認証後のリダイレクトが正しく動作しない

**原因:**
- `AUTH_URL`または`NEXTAUTH_URL`が正しく設定されていない
- または、OAuthプロバイダーのリダイレクトURLが正しく設定されていない

**解決方法:**
1. Vercelで`AUTH_URL`を明示的に設定
2. OAuthプロバイダーのリダイレクトURLを再確認

---

## 📚 参考情報

- [NextAuth v5 Documentation](https://authjs.dev/)
- [NextAuth v5 Migration Guide](https://authjs.dev/getting-started/migrating-to-v5)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ まとめ

### 質問への回答

**Q: `NEXTAUTH_URL`は本番環境のURLに修正する必要がありますか？**

**A: 通常は不要です。** NextAuth v5では自動検出されるため、設定しなくても動作します。

ただし、以下の場合は設定を推奨します：

1. **明示的に設定したい場合**: `AUTH_URL=https://your-app.vercel.app`を設定
2. **既存の`.env`ファイルに設定がある場合**: Vercelでも同じ値を設定（一貫性のため）

**最も重要なのは、OAuthプロバイダー（Google、GitHub）のリダイレクトURL設定です。** こちらは必ず本番環境のURLを設定してください。

---

**作成日:** 2024年  
**最終更新:** 2024年

