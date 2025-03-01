import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthApi } from '@/hooks/use-auth-api';

type DeleteCategoryProps = {
  categoryId: number;
  onDelete: () => void;
  children: React.ReactNode;
};

export const DeleteCategory = ({
  children,
  onDelete,
  categoryId,
}: DeleteCategoryProps) => {
  const authApi = useAuthApi();
  const queryClient = useQueryClient();

  const deleteCategory = async () => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    deleteCategoryMutation.mutate();
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: async () => authApi.delete(`/v1/categories/${categoryId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['category', categoryId],
      });
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      onDelete();
    },
  });
  return <div onClick={deleteCategory}>{children}</div>;
};
