import { toast } from 'sonner';
import { capitalize } from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';

import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { Product } from '@/features/products/types';
import { DeleteProduct } from '@/features/products/components/DeleteProduct';

export const ProductDetailPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const fetchProduct = async () => {
    const response = await authApi.get(`/v1/products/${id}/`);
    return response.data;
  };

  const { data, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: fetchProduct,
  });

  const handleProductDelete = async () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast.success('Product deleted successfully');
    navigate('/products');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className='space-y-4'>
        {data ? (
          <>
            <div className='flex justify-end space-x-2'>
              <Link to={`/categories/${id}/edit`}>
                <Button
                  size='sm'
                  className='text-white bg-blue-600'
                >
                  Edit
                </Button>
              </Link>
              <DeleteProduct
                productId={Number(id)}
                onDelete={handleProductDelete}
              >
                <Button
                  size='sm'
                  variant='destructive'
                >
                  Delete
                </Button>
              </DeleteProduct>
            </div>
            <div className='flex flex-col gap-4 md:flex-row items-center'>
              {data.image && (
                <div>
                  <img
                    src={data.image}
                    alt={data.name}
                    className='w-28 h-3w-28 object-cover rounded-md border'
                  />
                </div>
              )}

              <PageTitle
                title={capitalize(data.name)}
                subtitle={data.description || ''}
              />
            </div>
          </>
        ) : (
          <div>Category data not found</div>
        )}
      </div>
    </PageTransition>
  );
};
