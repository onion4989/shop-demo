// 定義

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type ProductsProps = {
  id: number;
  productId: string;
  name: string;
  categoryId: string;
  price: number;
  description: string;
  createdDate: Date;
  updatedDate: Date;
};

export type ProductImageProps = {
  id: number;
  productId: string;
  thumbnailUrl: string;
  imageUrl_1: string | null;
  imageUrl_2: string | null;
  imageUrl_3: string | null;
  imageUrl_4: string | null;
  imageUrl_5: string | null;
  imageUrl_6: string | null;
};

export type NutritionalInfoProps = {
  id: number;
  productId: string;
  energy: number | null;
  protein: number | null;
  fat: number | null;
  carbohydrates: number | null;
  saltEquivalent: number | null;
  allergen: string | null;
};

export type CategoryItem = {
  id: number;
  categoryId: string;
  name: string;
};

export type CategoryProps = CategoryItem[];

/**
 * Option モデル相当
 * - AdminOptions.tsx などから利用
 */
export type OptionProps = {
  takeoutAvailable: boolean;
  seasonal: boolean;
  bulkPurchase: boolean;
  couponAvailable: boolean;
} | null;

export type SearchProductsProps = {
  category: {
    name: string;
  };
  price: number;
  productId: string;
  name: string;
  images: {
    thumbnailUrl: string;
  }[];
};

export type FetchDashboardSearchProductProps = {
  productId: string;
  name: string;
  price: number;
  description: string | null;
  images: {
    thumbnailUrl: string;
    imageUrl_1: string | null;
    imageUrl_2: string | null;
    imageUrl_3: string | null;
    imageUrl_4: string | null;
    imageUrl_5: string | null;
    imageUrl_6: string | null;
  }[];
  category: {
    name: string;
    categoryId: string;
  };
  option: {
    bulkPurchase: boolean;
    couponAvailable: boolean;
    seasonal: boolean;
    takeoutAvailable: boolean;
  } | null;
};

/* =========================
 * 管理画面（dashboard/all）用の型
 * ========================= */

/**
 * 管理画面: カテゴリ情報（セレクト用）
 * Category モデルに対応
 */
export type AdminCategoryOption = {
  id: number;
  categoryId: string;
  name: string;
};

/**
 * 管理画面: 一覧に表示する商品1件分
 * Product / ProductImage / Category を束ねた ViewModel
 */
export type AdminProductListItem = {
  id: number;
  productId: string;
  name: string;
  price: number;
  categoryName: string;
  thumbnailUrl: string | null;
  recommend: number; // 0: 通常 / 1以上: おすすめランク
};

/**
 * 管理画面: 検索条件
 * Product / Category / Option / recommend をまとめた検索用パラメータ
 */
export type AdminProductSearchOptions = {
  keyword: string;
  categoryId: string | null; // Category.categoryId を利用

  priceRange:
    | "ALL"
    | "UNDER_500"
    | "BETWEEN_500_999"
    | "BETWEEN_1000_1999"
    | "OVER_2000";

  // Option テーブル由来のフラグ
  takeoutAvailable: boolean;
  seasonal: boolean;
  bulkPurchase: boolean;
  couponAvailable: boolean;

  // Product.recommend > 0 のみ抽出するフラグ
  recommendedOnly: boolean;
};

/**
 * 管理画面: 検索レスポンス
 */
export type AdminProductSearchResponse = {
  products: AdminProductListItem[];
  totalCount: number;    // 全商品数（フィルタなし）
  filteredCount: number; // 検索条件に一致した件数
};
