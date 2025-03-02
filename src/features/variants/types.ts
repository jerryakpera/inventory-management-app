import { Product } from '@/features/products/types';

export type AddProductVariant = {
  size: string;
  price: string;
  product: number;
  is_active: boolean;
  image?: string | null;
  brand?: string | null;
  flavor?: string | null;
  description?: string | null;
};

export type ProductVariant = {
  id: number;
  sku: string;
  name: string;
  size: string;
  unit: string;
  slug: string;
  price: string;
  updated: string;
  created: string;
  product?: Product;
  is_active: boolean;
  is_deleted: boolean;
  image?: string | null;
  brand?: string | null;
  author?: number | null;
  flavor?: string | null;
  description?: string | null;
};
