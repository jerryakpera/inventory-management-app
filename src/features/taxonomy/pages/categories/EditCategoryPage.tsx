import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { Category } from '@/features/taxonomy/types';
import { CategoryForm } from '@/features/taxonomy/forms';

export const EditCategoryPage = () => {
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const updateCategoryMutation = useMutation({
    mutationKey: ['updateCategory', id],
    mutationFn: (formData: FormData) =>
      authApi.patch(`/v1/categories/${id}/`, formData),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['category', id] });
    },
  });

  const onSubmit = async (formData: FormData) => {
    updateCategoryMutation.mutate(formData);

    toast.success('Category updated successfully');
    navigate(-1);
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
                title={`Edit category - ${data.name}`}
                subtitle='Complete the form to modify this category'
              />
            </div>
            <CategoryForm
              category={data}
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
