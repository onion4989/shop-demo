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

export type CategoryProps = {
  id: number;
  categoryId: string;
  name: string;
}[];

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
