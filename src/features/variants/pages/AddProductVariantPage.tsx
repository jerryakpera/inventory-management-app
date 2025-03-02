import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { Product } from '@/features/products/types';
import { ProductVariantForm } from '@/features/variants/forms';

export const AddProductVariantPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products, isLoading: productsIsLoading } = useQuery<Product[]>({
    queryFn: async () => {
      const response = await authApi.get('/v1/products/?limit=100');
      return response.data.results;
    },
    queryKey: ['products'],
  });

  const addProductVariantMutation = useMutation({
    mutationKey: ['add-variant'],
    mutationFn: (formData: FormData) => authApi.post('/v1/variants/', formData),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['variants'] });
    },
    onError: (error: {
      response?: { data: { detail?: string } };
      request?: XMLHttpRequest;
      message?: string;
    }) => {
      if (error.response && error.response.data) {
        const firstError = error.response.data;

        const errorKey = Object.keys(firstError)[0];
        const errorMessage = (firstError as Record<string, string[]>)[
          errorKey
        ][0];

        toast.error(errorMessage);

        return;
      }

      toast.error('Variant not saved. Please try again.');
    },
  });

  const onSubmit = async (formData: FormData) => {
    addProductVariantMutation.mutate(formData);

    toast.success('Variant added successfully!');
    navigate('/variants');
  };

  if (productsIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className='space-y-4'>
        <div>
          <h1 className='text-xl font-bold tracking-wide'>
            Add a new product variant
          </h1>
          <h3 className='text-sm text-gray-700 font-medium'>
            Fill in the form to add a new variant to a product.
          </h3>
        </div>

        {products && products.length && (
          <ProductVariantForm
            onSubmit={onSubmit}
            products={products}
          />
        )}
      </div>
    </PageTransition>
  );
};
