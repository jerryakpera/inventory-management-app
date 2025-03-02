import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { noImage } from '@/assets/images';

import { Product } from '@/features/products/types';

type ProductListItemProps = {
  product: Product;
};

export const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <div className='bg-white dark:bg-transparent dark:border dark:border-gray-700 shadow-sm rounded-md duration-500 hover:shadow-md'>
      <Link to={`/products/${product.id}`}>
        <img
          alt={product.name}
          src={product.image || noImage}
          className='h-40 w-full object-cover rounded-t-md'
        />
        <div className='px-4 py-3 w-full'>
          <span className='text-gray-400 mr-3 uppercase text-xs'>Brand</span>
          <h4 className='text-lg font-bold text-black dark:text-white truncate block capitalize'>
            {product.name}
          </h4>
          {product.description && (
            <p className='text-sm text-gray-700 dark:text-gray-300 font-medium'>
              {product.description.slice(0, 50)}
            </p>
          )}
          <div className='font-semibold text-black dark:text-white cursor-auto my-3'>
            {product.variant_count} product
            {product.variant_count === 1 ? '' : 's'}
          </div>
        </div>
      </Link>
    </div>
  );
};
