import { PageTitle } from '@/components/shared';
import { PageTransition } from '@/components/theme';
import {
  ProductsTable,
  productColumns,
} from '@/features/products/components/table';

export const ProductsPage = () => {
  return (
    <PageTransition>
      <div className='py-4 sm:py-10 space-y-4'>
        <PageTitle
          title='Products'
          subtitle='View and manage the list of products available in the inventory'
        />

        <ProductsTable columns={productColumns} />
      </div>
    </PageTransition>
  );
};
