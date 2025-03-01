import { toast } from 'sonner';
import { capitalize } from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';

import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { Category } from '@/features/taxonomy/types';
import { ProductsList } from '@/features/products/components/list/ProductsList';

export const CategoryPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const fetchCategory = async () => {
    const response = await authApi.get(`/v1/categories/${id}/`);
    return response.data;
  };

  const deleteCategory = async () => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await authApi.delete(`/v1/categories/${id}/`);
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['category', id],
      });
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      toast.success('Category deleted successfully');
      navigate('/categories');
    },
  });

  const { data, isLoading } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: fetchCategory,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className='space-y-4'>
        {data ? (
          <>
            <PageTitle
              title={`${capitalize(data.name)} - Category`}
              subtitle={data.description}
            />

            <div className='flex justify-end space-x-2'>
              <Link to={`/categories/${id}/edit`}>
                <Button
                  size='sm'
                  className='text-white bg-blue-600'
                >
                  Edit
                </Button>
              </Link>
              <Button
                size='sm'
                variant='destructive'
                onClick={() => deleteCategoryMutation.mutate()}
              >
                Delete
              </Button>
            </div>

            {data.image && (
              <div>
                <img
                  src={data.image}
                  alt={data.name}
                  className='w-32 h-3w-32 object-cover rounded-md border'
                />
              </div>
            )}

            <ProductsList products={data.products} />
          </>
        ) : (
          <div>Category data not found</div>
        )}
      </div>
    </PageTransition>
  );
};
