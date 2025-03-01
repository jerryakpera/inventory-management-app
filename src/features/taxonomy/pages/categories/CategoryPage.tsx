import { toast } from 'sonner';
import { capitalize } from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';

import {
  ProductsTable,
  productColumns,
} from '@/features/products/components/table';
import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { Category } from '@/features/taxonomy/types';
import { DeleteCategory } from '@/features/taxonomy/components';

export const CategoryPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const fetchCategory = async () => {
    const response = await authApi.get(`/v1/categories/${id}/`);
    return response.data;
  };

  const { data, isLoading } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: fetchCategory,
  });

  const handleCategoryDelete = async () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    toast.success('Category deleted successfully');
    navigate('/categories');
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
              <DeleteCategory
                categoryId={Number(id)}
                onDelete={handleCategoryDelete}
              >
                <Button
                  size='sm'
                  variant='destructive'
                >
                  Delete
                </Button>
              </DeleteCategory>
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
                title={`${capitalize(data.name)} - ${
                  data.product_count
                } product(s)`}
                subtitle={data.description}
              />
            </div>

            <ProductsTable
              columns={productColumns}
              categoryId={String(data.id)}
            />
          </>
        ) : (
          <div>Category data not found</div>
        )}
      </div>
    </PageTransition>
  );
};
