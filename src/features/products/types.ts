export type Product = {
  id: number;
  author: number;
  name: string;
  variant_count: number;
  category?: number | null;
  category_name: string | null;
  tags: string[];
  description?: string | null;
  slug: string;
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
