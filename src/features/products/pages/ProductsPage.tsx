import {
  ProductsTable,
  productColumns,
} from '@/features/products/components/table';

export const ProductsPage = () => {
  return (
    <div className='container mx-auto py-10'>
      <ProductsTable columns={productColumns} />
    </div>
  );
};
