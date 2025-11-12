#!/usr/bin/env bash
set -euo pipefail

echo "=== 現在配置の監査（存在確認）==="
check() {
  local p="$1"
  if [ -e "$p" ]; then
    echo "✅ あり: $p"
  else
    echo "❌ なし: $p"
  fi
}

# 期待ディレクトリ
for d in \
  "features/admin/components" \
  "features/auth/components" \
  "features/catalog/components" \
  "features/search/components" \
  "lib/server" "lib/server/repositories" "lib/server/seed" "lib/client" \
  "components/banner" "components/footer" "components/header" "components/hero" \
  "app/(marketing)" "app/(search)"; do
  check "$d"
done

echo ""
echo "=== 重要ファイルの現在位置（想定 → 実在チェック）==="

# 旧→新の代表サンプル（必要に応じてここに行追加）
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

for src in "${!MAP[@]}"; do
  dst="${MAP[$src]}"
  if [ -e "$src" ]; then
    echo "🔹 旧位置あり: $src"
  fi
  if [ -e "$dst" ]; then
    echo "   └─ 既に新位置あり: $dst"
  fi
done

echo ""
echo "※ 上の出力を見て、旧位置が残っていれば『未移動』、新位置だけあれば『移動済み』です。"
