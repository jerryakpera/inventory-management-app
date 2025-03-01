import { Product } from '../products/types';

export type AddCategory = {
  name: string;
  description: string;
  image?: string | null;
};

export type Category = {
  id: number;
  product_count: number;
  name: string;
  description: string;
  products: Product[];
  image: string | null;
  updated: string;
  created: string;
  slug: string;
};
