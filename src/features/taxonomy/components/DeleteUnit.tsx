import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthApi } from '@/hooks/use-auth-api';

type DeleteUnitProps = {
  unitId: number;
  onDelete: () => void;
  children: React.ReactNode;
};

export const DeleteUnit = ({ unitId, children, onDelete }: DeleteUnitProps) => {
  const authApi = useAuthApi();
  const queryClient = useQueryClient();

  const deleteUnit = async () => {
    if (!confirm('Are you sure you want to delete this unit?')) return;
    deleteUnitMutation.mutate();
  };

  const deleteUnitMutation = useMutation({
    mutationFn: async () => authApi.delete(`/v1/units/${unitId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['unit', unitId],
      });
      queryClient.invalidateQueries({
        queryKey: ['units'],
      });

      onDelete();
    },
  });
  return <div onClick={deleteUnit}>{children}</div>;
};
