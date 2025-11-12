#!/usr/bin/env bash
set -euo pipefail

# shop-demo 直下チェック
if [ ! -f "package.json" ] || [ ! -d "app" ]; then
  echo "✖ このスクリプトは Next.js プロジェクトのルートで実行してください。"
  exit 1
fi

# DRY-RUN切替: 1なら動作ログのみ、0なら実際に移動
DRY_RUN=${DRY_RUN:-0}

log() { echo "$@"; }

mkd() {
  local d="$1"
  if [ "$DRY_RUN" -eq 1 ]; then log "mkdir -p '$d'"; else mkdir -p "$d"; fi
}

do_mv() {
  local src="$1"; local dst="$2"
  [ -e "$src" ] || { log "… スキップ: '$src' が無い"; return 0; }
  mkd "$(dirname "$dst")"
  if git ls-files --error-unmatch "$src" >/dev/null 2>&1; then
    if [ "$DRY_RUN" -eq 1 ]; then log "git mv '$src' '$dst'"; else git mv "$src" "$dst"; fi
  else
    if [ "$DRY_RUN" -eq 1 ]; then log "mv '$src' '$dst' && git add -A '$dst'"; else mv "$src" "$dst"; git add -A "$dst" || true; fi
  fi
  log "→ 移動: '$src' → '$dst'"
}

log "=== 必要ディレクトリの作成 ==="
for d in \
  "features/admin/components" \
  "features/auth/components" \
  "features/catalog/components" \
  "features/search/components" \
  "lib/server" "lib/server/repositories" "lib/server/seed" "lib/client" \
  "components/banner" "components/footer" "components/header" "components/hero" \
  "app/(marketing)" "app/(search)"; do
  mkd "$d"
done

log "=== 旧→新 ルールに基づき一括移動 ==="
# 旧→新 マップ（監査と同一）
declare -A MAP=(
  ["app/(home)/layout.tsx"]="app/(marketing)/layout.tsx"
  ["app/(home)/page.tsx"]="app/(marketing)/page.tsx"
  ["app/(home)/policy/page.tsx"]="app/(marketing)/policy/page.tsx"
  ["app/(home)/term/page.tsx"]="app/(marketing)/term/page.tsx"

  ["app/(home)/search/page.tsx"]="app/(search)/page.tsx"
  ["app/(home)/search/[productid]"]="app/(search)/[productId]"
  ["app/(home)/search/clientSearch.tsx"]="features/search/components/ClientSearch.tsx"
  ["app/(home)/search/forms.tsx"]="features/search/components/SearchForm.tsx"

  ["cards/product-items.tsx"]="features/catalog/components/ProductItems.tsx"
  ["cards/loading.tsx"]="components/Loading.tsx"

  ["components/(dashboard)/edit/edit-forms.tsx"]="features/admin/components/EditForm.tsx"
  ["components/(dashboard)/login/signOutButton.tsx"]="features/auth/components/SignOutButton.tsx"

  ["components/card/card.tsx"]="features/catalog/components/ProductCard.tsx"
  ["components/detail/detail-info.tsx"]="features/catalog/components/ProductDetailInfo.tsx"
  ["components/detail/nutritional.tsx"]="features/catalog/components/ProductNutritional.tsx"

  ["components/banner/banner.tsx"]="components/banner/Banner.tsx"
  ["components/footer/footer-bar.tsx"]="components/footer/FooterBar.tsx"
  ["components/footer/footer-images.tsx"]="components/footer/FooterImages.tsx"
  ["components/footer/footer-info.tsx"]="components/footer/FooterInfo.tsx"
  ["components/footer/index.tsx"]="components/footer/index.ts"
  ["components/header/acmeLogo.jsx"]="components/header/Logo.tsx"
  ["components/header/navi.tsx"]="components/header/Navigation.tsx"
  ["components/hero/hero.tsx"]="components/hero/Hero.tsx"

  ["lib/data-prisma-singleton.ts"]="lib/server/prisma.ts"
  ["lib/prisam.ts"]="lib/server/prisma.ts"
  ["lib/definitions.ts"]="lib/types.ts"
  ["lib/data.ts"]="lib/server/seed/data.ts"
  ["lib/actions.ts"]="lib/server/actions.ts"

  ["providers/nextauth.tsx"]="features/auth/AuthProvider.tsx"

  ["ui/control/category.tsx"]="features/search/components/CategoryFilter.tsx"
  ["ui/control/options.tsx"]="features/search/components/OptionsFilter.tsx"
  ["ui/control/price.tsx"]="features/search/components/PriceFilter.tsx"
  ["ui/control/term.tsx"]="features/search/components/TermFilter.tsx"

  ["ui/dashboard/control/button.tsx"]="features/admin/components/AdminButton.tsx"
  ["ui/dashboard/control/image-file.tsx"]="features/admin/components/ImageFileInput.tsx"
  ["ui/dashboard/control/options.tsx"]="features/admin/components/AdminOptions.tsx"
  ["ui/dashboard/login/login-form.tsx"]="features/auth/components/LoginForm.tsx"
  ["ui/dashboard/sidenav.tsx"]="features/admin/components/DashboardSideNav.tsx"

  ["ui/search/forms.tsx"]="features/search/components/SearchForm.tsx"
  ["ui/search/hit.tsx"]="features/search/components/SearchHit.tsx"
  ["ui/search/result.tsx"]="features/search/components/SearchResults.tsx"
)

# 実行
for src in "${!MAP[@]}"; do
  dst="${MAP[$src]}"
  do_mv "$src" "$dst"
done

log "=== Prisma 二重定義の注意 ==="
if [ -e "lib/server/prisma.ts" ]; then
  log "⚠ 'lib/server/prisma.ts' へ統合済み。内容が二重なら手動でマージし、重複元ファイルは削除してください。"
fi

log "=== 完了。'git status' で確認し、問題なければコミットしてください。==="
