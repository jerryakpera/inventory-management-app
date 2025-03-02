import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { CategoryForm } from '@/features/taxonomy/forms/CategoryForm';

export const AddCategoryPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addCategory = async (formData: FormData) => {
    const response = await authApi.post('/v1/categories/', formData);
    return response.data;
  };

  const addCategoryMutation = useMutation({
    mutationKey: ['add-category'],
    mutationFn: addCategory,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
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

      toast.error('Category not saved. Please try again.');
    },
  });

  const onSubmit = async (formData: FormData) => {
    addCategoryMutation.mutate(formData);

    toast.success('Category added successfully!');
    navigate('/categories');
  };

  return (
    <PageTransition>
      <div className='space-y-4'>
        <div>
          <h1 className='text-xl font-bold tracking-wide'>Add Product</h1>
          <h3 className='text-sm text-gray-700 font-medium'>
            Fill in the form to add a new category to the inventory.
          </h3>
        </div>

        <CategoryForm onSubmit={onSubmit} />
      </div>
    </PageTransition>
  );
};
