#!/usr/bin/env bash
set -euo pipefail

# 実行場所チェック（shop-demo 直下で実行してください）
if [ ! -f "package.json" ] || [ ! -d "app" ]; then
  echo "✖ このスクリプトは Next.js プロジェクトのルート（shop-demo）で実行してください。"
  exit 1
fi

# 便利関数: あるなら移動（git 管理なら git mv、非管理なら mv）
move() {
  local src="$1"
  local dst="$2"

  if [ ! -e "$src" ]; then
    echo "… スキップ: 存在しないため '$src'"
    return 0
  fi

  mkdir -p "$(dirname "$dst")"

  if git ls-files --error-unmatch "$src" >/dev/null 2>&1; then
    git mv "$src" "$dst"
  else
    mv "$src" "$dst"
    git add -A "$dst" >/dev/null 2>&1 || true
  fi

  echo "→ 移動: '$src'  →  '$dst'"
}

echo "=== ディレクトリ作成 ==="
mkdir -p \
  "features/admin/components" \
  "features/auth/components" \
  "features/catalog/components" \
  "features/search/components" \
  "lib/server/repositories" \
  "lib/server/seed" \
  "lib/client" \
  "components/banner" \
  "components/footer" \
  "components/header" \
  "components/hero" \
  "app/(marketing)" \
  "app/(search)"

echo "=== app/(home) 系 → (marketing)/(search) へ ==="
move 'app/(home)/layout.tsx' 'app/(marketing)/layout.tsx'
move 'app/(home)/page.tsx' 'app/(marketing)/page.tsx'
move 'app/(home)/policy' 'app/(marketing)/policy'
move 'app/(home)/term' 'app/(marketing)/term'
move 'app/(home)/search/page.tsx' 'app/(search)/page.tsx'
move 'app/(home)/search/[productid]' 'app/(search)/[productId]'
move 'app/(home)/search/clientSearch.tsx' 'features/search/components/ClientSearch.tsx'
move 'app/(home)/search/forms.tsx' 'features/search/components/SearchForm.tsx'

echo "=== app/(admin) の補助ファイル ==="
move 'app/(admin)/dashboard/all/adminAllClient.tsx' 'features/admin/components/AdminAllClient.tsx'
move 'app/(admin)/dashboard/clientProviders.tsx' 'app/(admin)/dashboard/client-providers.tsx'
# 他の app/(admin) 下の page/layout はルーティングのためそのまま

echo "=== cards → features/catalog/components など ==="
move 'cards/product-items.tsx' 'features/catalog/components/ProductItems.tsx'
move 'cards/loading.tsx' 'components/Loading.tsx'

echo "=== components/(dashboard) → features/** ==="
move 'components/(dashboard)/edit/edit-forms.tsx' 'features/admin/components/EditForm.tsx'
move 'components/(dashboard)/login/signOutButton.tsx' 'features/auth/components/SignOutButton.tsx'

echo "=== components 命名整理 / カタログ機能へ ==="
move 'components/card/card.tsx' 'features/catalog/components/ProductCard.tsx'
move 'components/detail/detail-info.tsx' 'features/catalog/components/ProductDetailInfo.tsx'
move 'components/detail/nutritional.tsx' 'features/catalog/components/ProductNutritional.tsx'

echo "=== components の PascalCase 統一 ==="
move 'components/banner/banner.tsx' 'components/banner/Banner.tsx'
move 'components/footer/footer-bar.tsx' 'components/footer/FooterBar.tsx'
move 'components/footer/footer-images.tsx' 'components/footer/FooterImages.tsx'
move 'components/footer/footer-info.tsx' 'components/footer/FooterInfo.tsx'
move 'components/footer/index.tsx' 'components/footer/index.ts'
move 'components/header/acmeLogo.jsx' 'components/header/Logo.tsx'
move 'components/header/navi.tsx' 'components/header/Navigation.tsx'
move 'components/hero/hero.tsx' 'components/hero/Hero.tsx'

echo "=== lib の整理（Prisma統合 / 型 / シード） ==="
# Prisma シングルトンは lib/server/prisma.ts に統合。両方存在する場合は後で内容をマージしてください。
if [ -e 'lib/data-prisma-singleton.ts' ] && [ -e 'lib/prisam.ts' ]; then
  echo "⚠ 注意: 'lib/data-prisma-singleton.ts' と 'lib/prisam.ts' が両方存在します。内容を手動で統合してください。"
  move 'lib/data-prisma-singleton.ts' 'lib/server/prisma.ts'
  # prisam.ts は後で手動マージして削除
else
  move 'lib/data-prisma-singleton.ts' 'lib/server/prisma.ts'
  move 'lib/prisam.ts' 'lib/server/prisma.ts' || true
fi

move 'lib/definitions.ts' 'lib/types.ts'
move 'lib/data.ts' 'lib/server/seed/data.ts'
move 'lib/actions.ts' 'lib/server/actions.ts'

echo "=== providers → features/auth ==="
move 'providers/nextauth.tsx' 'features/auth/AuthProvider.tsx'

echo "=== ui → features/** or 残置 ==="
move 'ui/control/category.tsx' 'features/search/components/CategoryFilter.tsx'
move 'ui/control/options.tsx' 'features/search/components/OptionsFilter.tsx'
move 'ui/control/price.tsx' 'features/search/components/PriceFilter.tsx'
move 'ui/control/term.tsx' 'features/search/components/TermFilter.tsx'

move 'ui/dashboard/control/button.tsx' 'features/admin/components/AdminButton.tsx'
move 'ui/dashboard/control/image-file.tsx' 'features/admin/components/ImageFileInput.tsx'
move 'ui/dashboard/control/options.tsx' 'features/admin/components/AdminOptions.tsx'
move 'ui/dashboard/login/login-form.tsx' 'features/auth/components/LoginForm.tsx'
move 'ui/dashboard/sidenav.tsx' 'features/admin/components/DashboardSideNav.tsx'

# 検索UIの重複を features/search に統合
move 'ui/search/forms.tsx' 'features/search/components/SearchForm.tsx'
move 'ui/search/hit.tsx' 'features/search/components/SearchHit.tsx'
move 'ui/search/result.tsx' 'features/search/components/SearchResults.tsx'

# ui のプリミティブは残置
# ui/skeletons.tsx, ui/spinner.tsx はそのまま

echo "=== 完了 ==="
echo "次の対応を行ってください："
echo "1) tsconfig.json の paths を設定（@features/* など）"
echo "2) 競合ファイル（特に lib/server/prisma.ts）を手動で統合"
echo "3) import パスを @features/@components/@lib へ置換"
echo "4) 動作確認: npm run build / next dev"
