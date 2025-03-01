import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { ProductForm } from '@/features/products/forms/ProductForm';

export const AddProductPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchCategories = async () => {
    const response = await authApi.get('/v1/categories/?limit=100');
    return response.data.results;
  };

  const fetchUnits = async () => {
    const response = await authApi.get('/v1/units/?limit=100');
    return response.data.results;
  };

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const unitsQuery = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const addProductMutation = useMutation({
    mutationKey: ['add-product'],
    mutationFn: (formData: FormData) => authApi.post('/v1/products/', formData),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
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

      toast.error('Product not saved. Please try again.');
    },
  });

  const onSubmit = async (formData: FormData) => {
    addProductMutation.mutate(formData);

    toast.success('Product added successfully!');
    navigate('/products');
  };

  if (categoriesQuery.isLoading || unitsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className='py-4 sm:py-10 space-y-4'>
        <div>
          <h1 className='text-xl font-bold tracking-wide'>Add Product</h1>
          <h3 className='text-sm text-gray-700 font-medium'>
            Fill in the form to add a new product to the inventory.
          </h3>
        </div>

        <ProductForm
          units={unitsQuery.data}
          handleFormSubmit={onSubmit}
          categories={categoriesQuery.data}
        />
      </div>
    </PageTransition>
  );
};
