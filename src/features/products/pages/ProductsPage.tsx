import { PageTransition } from '@/components/theme';
import {
  ProductsTable,
  productColumns,
} from '@/features/products/components/table';

export const ProductsPage = () => {
  return (
    <PageTransition>
      <div className='py-4 sm:py-10 space-y-4'>
        <div>
          <h1 className='text-xl font-bold tracking-wide'>Products</h1>
          <h3 className='text-sm text-gray-700 font-medium'>
            View and manage the list of products available in the inventory
          </h3>
        </div>
        <ProductsTable columns={productColumns} />
      </div>
    </PageTransition>
  );
};
