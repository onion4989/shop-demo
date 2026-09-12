# shop-demo / CAKE-SHOP — デプロイ・復旧手順書

GitHub Actions + GHCR + Dokploy の **本リポジトリ固有**の手順。  
横断方針は Obsidian `_knowledge` を正とし、ここには **CAKE-SHOP の値と手順だけ**を書く。

**秘密・Webhook URL・PAT・Connection 文字列の実値は書かない。** Dokploy / パスワードマネージャ / GitHub Secrets を見ること。

---

## 0. 入口（Agent はここから）

### 適用範囲

- アプリ: **shop-demo**（Sugar Alice）
- 本番: Dokploy **Works > CAKE-SHOP**
- ローカル Docker Desktop / `docker compose` は **開発用 DB のみ**（本番 Provider には使わない）

### 横断ドキュメント（先に方針を確認）

| 用途 | パス |
|------|------|
| 日常デプロイ方針（GHCR 標準） | `~/projects/_knowledge/30-playbooks/dokploy-deploy.md` |
| VPS / Dokploy 消失後の全体順序 | `~/projects/_knowledge/30-playbooks/dokploy-vps-recovery.md` |
| Prisma migrate / seed 一般 | `~/projects/_knowledge/20-stack/prisma.md` |

### やってはいけないこと（本プロジェクト）

- Dokploy で **Git / Nixpacks ビルド**する（VPS 上で `next build` しない）
- ローカル `.env` に Dokploy **Internal** ホスト名（例: `works-cakeshop-...`）を書いて seed する
- External Port を開けっぱなしにする
- Webhook URL / PAT / DB パスワードを Git・チャット・本手順書に書く
- subscription-memo の `DOKPLOY_DEPLOY_WEBHOOK_URL` を shop-demo に流用する（**repo ごとに別 URL**。Secret **名**は同じでよい）

---

## 1. 固有値一覧（正本）

| 項目 | 値 |
|------|-----|
| GitHub repo | `https://github.com/onion4989/shop-demo` |
| デプロイブランチ | `main` |
| Workflow | `.github/workflows/deploy.yml`（`Build and Push Docker Image`） |
| GHCR イメージ | `ghcr.io/onion4989/shop-demo:latest`（＋ commit SHA タグ） |
| Dokploy Project | **Works** |
| Dokploy App | **CAKE-SHOP** |
| Provider | **Docker**（Image / Registry。Git ビルドではない） |
| Registry URL | `ghcr.io` |
| Registry Username | `onion4989` |
| Registry Password | GitHub PAT（`read:packages`）。MEMO / portfolio と流用可 |
| Container Port | `3000` |
| GitHub Secret（shop-demo repo） | `DOKPLOY_DEPLOY_WEBHOOK_URL` |
| Secrets 画面 | https://github.com/onion4989/shop-demo/settings/secrets/actions |
| Actions 画面 | https://github.com/onion4989/shop-demo/actions |
| Packages | https://github.com/onion4989?tab=packages |
| 必須 Env（アプリ） | `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` |
| 任意 Env（認証等） | `AUTH_SECRET` / `RESEND_API_KEY` / `EMAIL_FROM` / `NEXT_PUBLIC_APP_URL` など |
| 起動時 migrate | `scripts/docker-entrypoint.sh` → `prisma migrate deploy` |
| Seed コマンド | `npm run db:seed`（`prisma/seed.sql`） |
| ローカル DB（compose） | `localhost:5433` / user・pass・db は `docker-compose.yml`（例: `shop`） |

Env は **CAKE-SHOP アプリサービス**に書く。Postgres サービスの Environment に書いてもアプリには渡らない。

---

## 2. 全体の流れ（日常）

```
開発者が main に push
  → GitHub Actions が Docker ビルド
  → GHCR に push（:latest / :<sha>）
  → Dokploy Webhook を POST
  → CAKE-SHOP が pull → entrypoint で migrate → node server.js
  → 本番 URL で煙確認
```

関連ファイル: `Dockerfile` / `.dockerignore` / `scripts/docker-entrypoint.sh` / `.github/workflows/deploy.yml`

---

## 3. シナリオ A — 日常デプロイ（コードを本番へ）

【状況】  
本番に出したい変更がローカルで確認済み。`main` に載せる。

【どうする】

1. 無関係な WIP・スナップショットを `main` に混ぜない（1 目的 = 1 ブランチ）
2. `main` にマージする
3. `git push origin main`
4. Actions で **Build and Push Docker Image** が成功することを確認
5. 必要なら GHCR の `shop-demo:latest` 更新時刻を確認
6. Webhook が走っていれば Dokploy の CAKE-SHOP が Deploy される（Secret 未設定ならスキップされる）
7. 本番 Top で煙確認（Ranking / Gift / Items、カート、fly-to-cart）

【確認】

- Actions 緑
- Dokploy CAKE-SHOP Done（緑）
- サイト表示 OK

【触らない】

- VPS 上での手動ビルド
- External Port（日常デプロイでは不要）

---

## 4. シナリオ B — CAKE-SHOP 初回／VPS 再インストール後の載せ直し

【状況】  
Dokploy 上の CAKE-SHOP が無い・作り直した・Provider 未設定。横断の VPS 復旧全体順序は `dokploy-vps-recovery` を Recreate。

【どうする】（**この順を守る**）

1. CAKE-SHOP 用 **Postgres** を作成し **Running** にする（アプリより先）
2. GHCR に `ghcr.io/onion4989/shop-demo:latest` があること  
   - 無ければ: GitHub Actions の Workflow permissions を Read and write → `main` push または **Run workflow**
3. CAKE-SHOP アプリを作成（または既存を開く）
4. Provider を **Docker** に設定（§1 の固有値）
5. アプリ Env に `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING`（Dokploy **Internal** Connection URL）
6. Domain / HTTPS / Port `3000`
7. Deploy Webhook を発行し、**shop-demo** の GitHub Secret `DOKPLOY_DEPLOY_WEBHOOK_URL` に登録（再発行したら必ず更新）
8. **イメージがある状態で** 手動 Deploy → Done
9. サイトの枠は出るが商品が空なら **シナリオ C（seed）** へ  
   （migrate はスキーマのみ。デモ商品データは戻らない）

【確認】

- Actions 成功済みで GHCR に `latest` がある
- CAKE-SHOP Done
- Top が 502 でない（空コンテンツは seed 前として許容）

【触らない】

- イメージが無い状態での Deploy
- Git Provider への切り替え

---

## 5. シナリオ C — 本番 DB へ seed（データ復旧）

【状況】  
スキーマはある（または migrate 済み）が Category / Product 等が空で、Hero / Gift / Items が出ない。

【前提】

- `prisma/seed.sql` がリポジトリにある（`npm run db:seed` が参照）
- seed は `ON CONFLICT` 付きで再実行可（デモ用固定ダミーのみ）

### C-1. 推奨: ローカルから External Port 経由

【どうする】

1. Dokploy の **CAKE-SHOP 用 Postgres** で External Port を短時間だけ開ける（例: `5434`）
2. エックスサーバー VPS の **パケットフィルター**で当該 TCP ポートの着信を許可  
   - OS 再起動は不要（フィルター保存後、数分待って確認）
3. Dokploy が表示する **External Host**（`postgresql://...@VPS_IP:PORT/db`）を確認
4. ローカル `.env` の次を **一時的に** External Host に合わせる  
   - `POSTGRES_PRISMA_URL`  
   - `POSTGRES_URL_NON_POOLING`
5. 接続確認してから seed:

```bash
# 例: ポート疎通
nc -vz <VPS_IP> <EXTERNAL_PORT>

cd ~/projects/shop-demo
npm run db:seed
# → Script executed successfully.
```

6. **片付け（必須）**  
   - Dokploy External Port を閉じる  
   - パケットフィルターの当該ポートを閉じる（不要なら）  
   - ローカル `.env` を開発用に戻す（例: `localhost:5433`）
7. 本番 Top を確認（`unstable_cache` のため最大約 5 分待つか Redeploy）

【確認】

- `npm run db:seed` が success
- Hero / Gift / Items に商品が出る

### C-2. 代替: VPS 上で seed（External Port を開けない場合）

【どうする】

1. `prisma/seed.sql` を VPS に置く
2. Postgres コンテナ上で `psql` 等により実行（Dokploy Terminal / SSH）
3. 本番 Top を確認

### C-3. よくある失敗（P1001）

【状況】

```text
Can't reach database server at `...`
```

【どうする】

| 原因 | 対処 |
|------|------|
| `.env` が Dokploy **Internal** ホスト | External Host に変更するか、VPS 上で seed（C-2） |
| External Port 未公開 / 未 Save | Dokploy で Port を開き Save、サービス Running を確認 |
| パケットフィルター未許可 | VPS で TCP ポートを許可。`nc -vz` で再確認 |
| Port 番号不一致 | External Host と `.env` のポートを揃える |

Prisma / `seed.sql` の構文より先に **TCP 疎通**を疑う。

---

## 6. トラブル早見表

| 症状 | 確認・対処 |
|------|------------|
| Actions が Webhook をスキップ | shop-demo の Secret `DOKPLOY_DEPLOY_WEBHOOK_URL` 未設定。登録後に Actions 再実行 |
| GHCR push 失敗 | repo Settings → Actions → Workflow permissions が Read and write か |
| Dokploy pull 失敗 | Image 名、`ghcr.io`、PAT `read:packages` |
| 起動直後の DB エラー | Env の `POSTGRES_*`、Postgres Running、entrypoint の migrate ログ |
| Done だが 502 | Port `3000`、コンテナログ |
| Top は出るが商品なし | シナリオ C（seed）。migrate だけではデータは入らない |
| ローカル dev が本番 Internal で落ちる | `.env` を `localhost:5433` に戻す（`npm run db:up`） |
| 変更が本番に出ない | Actions 成功 → GHCR `latest` → Dokploy デプロイログの順 |

---

## 7. Agent 用チェックリスト

### 日常 push

- [ ] `main` に載せる差分は目的どおりか（混ぜ物なし）
- [ ] `git push origin main`
- [ ] Actions「Build and Push Docker Image」成功
- [ ] CAKE-SHOP Done / 本番煙確認

### 載せ直し（復旧）

- [ ] 横断: `dokploy-vps-recovery` の全体順序を把握済み
- [ ] Postgres Running → その後アプリ
- [ ] GHCR `ghcr.io/onion4989/shop-demo:latest` あり
- [ ] Provider = Docker（§1）
- [ ] Env `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING`（Internal）
- [ ] Webhook → shop-demo の GitHub Secret
- [ ] 手動 Deploy → Done
- [ ] 商品が空ならシナリオ C

### Seed

- [ ] External Port + パケットフィルター（または VPS 上実行）
- [ ] `nc -vz` 成功
- [ ] `npm run db:seed` success
- [ ] External Port / フィルター閉鎖
- [ ] `.env` を localhost に戻す
- [ ] 本番で商品表示確認

---

## 8. 関連コード・設定

| パス | 内容 |
|------|------|
| `.github/workflows/deploy.yml` | build → GHCR → Webhook |
| `Dockerfile` | 本番イメージ（bookworm-slim / standalone） |
| `scripts/docker-entrypoint.sh` | `prisma migrate deploy` |
| `prisma/seed.sql` | デモ商品 seed |
| `package.json` | `db:seed` / `db:migrate` / `db:up` |
| `docker-compose.yml` | ローカル Postgres（5433） |

---

## 9. 関連（横断）

- `~/projects/_knowledge/30-playbooks/dokploy-deploy.md`
- `~/projects/_knowledge/30-playbooks/dokploy-vps-recovery.md`
- `~/projects/_knowledge/20-stack/prisma.md`
- `~/projects/_knowledge/10-standards/security.md`（seed は固定ダミーのみ）
