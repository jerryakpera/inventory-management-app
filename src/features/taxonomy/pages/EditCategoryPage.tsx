import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { CategoryForm } from '@/features/taxonomy/forms';
import { AddCategory, Category } from '@/features/taxonomy/types';

export const EditCategoryPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
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

  const onSubmit = async (formData: AddCategory) => {
    await authApi.put(`/v1/categories/${id}/`, formData);
    navigate(`/categories/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className='space-y-4'>
        {data ? (
          <>
            <PageTitle
              title={`Edit category - ${data.name}`}
              subtitle='Complete the form to modify this category'
            />
            <CategoryForm
              onSubmit={onSubmit}
              category={data}
            />
          </>
        ) : (
          <div>Category data not found</div>
        )}
      </div>
    </PageTransition>
  );
};
