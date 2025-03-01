export type AddProduct = {
  name: string;
  unit: number;
  tags?: string[];
  is_active: boolean;
  tagsString?: string;
  description: string;
  category: number | null;
};

export type ProductImage = {
  image: string;
};

export type Unit = {
  id: number;
  name: string;
  symbol: string;
};

export type Product = {
  id: number;
  author: number;
  name: string;
  variant_count: number;
  category?: number | null;
  category_name: string | null;
  description?: string | null;
  slug: string;
  tags: string[];
  unit: number;
  image?: string | null;
  is_active: boolean;
  updated: string;
  created: string;
};

export type ProductVariant = {
  id: number;
  sku: string;
  author: number;
  product: number;
  brand?: string | null;
  description?: string | null;
  size: number;
  flavor?: string | null;
  price: string;
  is_active: boolean;
  is_deleted: boolean;
  updated: string;
  created: string;
  slug: string;
  image?: string | null;
};
