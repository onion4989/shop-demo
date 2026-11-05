// 定義

export type CategoryItem = {
  id: number;
  categoryId: string;
  name: string;
};

export type CategoryProps = CategoryItem[];

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
