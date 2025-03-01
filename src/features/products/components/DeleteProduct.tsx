import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthApi } from '@/hooks/use-auth-api';

type DeleteProductProps = {
  productId: number;
  onDelete: () => void;
  children: React.ReactNode;
};

export const DeleteProduct = ({
  children,
  onDelete,
  productId,
}: DeleteProductProps) => {
  const authApi = useAuthApi();
  const queryClient = useQueryClient();

  const deleteProduct = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    deleteProductMutation.mutate();
  };

  const deleteProductMutation = useMutation({
    mutationFn: async () => authApi.delete(`/v1/products/${productId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product', productId],
      });
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });

      onDelete();
    },
  });
  return <div onClick={deleteProduct}>{children}</div>;
};
