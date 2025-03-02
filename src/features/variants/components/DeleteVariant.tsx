import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthApi } from '@/hooks/use-auth-api';

type DeleteVariantProps = {
  variantId: number;
  onDelete: () => void;
  children: React.ReactNode;
};

export const DeleteVariant = ({
  children,
  onDelete,
  variantId,
}: DeleteVariantProps) => {
  const authApi = useAuthApi();
  const queryClient = useQueryClient();

  const deleteVariant = async () => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    deleteVariantMutation.mutate();
  };

  const deleteVariantMutation = useMutation({
    mutationFn: async () => authApi.delete(`/v1/variants/${variantId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['variant', variantId],
      });
      queryClient.invalidateQueries({
        queryKey: ['variants'],
      });

      onDelete();
    },
  });
  return <div onClick={deleteVariant}>{children}</div>;
};
