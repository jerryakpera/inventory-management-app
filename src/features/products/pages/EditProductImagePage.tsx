import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { Product } from '@/features/products/types';
import { PageTransition } from '@/components/theme';
import { ProductImageForm } from '@/features/products/forms';

export const EditProductImagePage = () => {
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const updateProductMutation = useMutation({
    mutationKey: ['updateProduct', id],
    mutationFn: (formData: FormData) =>
      authApi.patch(`/v1/products/${id}/`, formData),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });

  const onSubmit = async (formData: FormData) => {
    updateProductMutation.mutate(formData);

    toast.success('Product image updated successfully');
    navigate(`/products/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className='space-y-4'>
        {data ? (
          <>
            <div className='flex gap-4 items-center'>
              {data.image && (
                <div>
                  <img
                    src={data.image}
                    alt={data.name}
                    className='w-20 h-20 object-cover rounded-lg'
                  />
                </div>
              )}
              <PageTitle
                title={`Edit product - ${data.name}`}
                subtitle='Complete the form to modify this product'
              />
            </div>
            <ProductImageForm
              product={data}
              onSubmit={onSubmit}
            />
          </>
        ) : (
          <div>Category data not found</div>
        )}
      </div>
    </PageTransition>
  );
};
