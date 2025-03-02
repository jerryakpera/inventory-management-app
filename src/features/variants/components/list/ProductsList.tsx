import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';

import { Product } from '@/features/products/types';
import { ProductListItem } from './ProductListItem';

type ProductsListProps = {
  products: Product[];
};

export const ProductsList = ({ products }: ProductsListProps) => {
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <div className='mt-3 col-span-4'>
        <h2 className='text-2xl font-semibold'>Products</h2>
        <Input
          value={search}
          placeholder='filter products'
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filteredProducts.map((product) => {
        return (
          <ProductListItem
            key={product.id}
            product={product}
          />
        );
      })}
    </div>
  );
};
