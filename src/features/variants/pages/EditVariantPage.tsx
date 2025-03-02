import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { Product } from '@/features/products/types';
import { ProductVariantForm } from '@/features/variants/forms';
import { ProductVariant } from '../types';

export const EditVariantPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const { data: products, isLoading: productsIsLoading } = useQuery<Product[]>({
    queryFn: async () => {
      const response = await authApi.get('/v1/products/?limit=100');
      return response.data.results;
    },
    queryKey: ['products'],
  });

  const { data, isLoading } = useQuery<ProductVariant>({
    queryKey: ['variant', id],
    queryFn: async () => {
      const response = await authApi.get(`/v1/variants/${id}/`);
      return response.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const updateVariantMutation = useMutation({
    mutationKey: ['updateProductVariant', id],
    mutationFn: (formData: FormData) =>
      authApi.patch(`/v1/variants/${id}/`, formData),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['variant', id] });
    },
  });

  const onSubmit = async (formData: FormData) => {
    console.log(formData);
    updateVariantMutation.mutate(formData);

    toast.success('Product variant updated successfully');
    navigate(-1);
  };

  if (isLoading || productsIsLoading) {
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
            {products && products.length && (
              <ProductVariantForm
                variant={data}
                products={products}
                onSubmit={onSubmit}
              />
            )}
          </>
        ) : (
          <div>Category data not found</div>
        )}
      </div>
    </PageTransition>
  );
};
