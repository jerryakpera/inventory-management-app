import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { UnitForm } from '@/features/taxonomy/forms';
import { Unit, AddUnit } from '@/features/taxonomy/types';

export const EditUnitPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const fetchUnit = async () => {
    const response = await authApi.get(`/v1/units/${id}/`);
    return response.data;
  };

  const { data, isLoading } = useQuery<Unit>({
    queryKey: ['unit', id],
    queryFn: fetchUnit,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const updateUnitMutation = useMutation({
    mutationKey: ['updateUnit', id],
    mutationFn: (formData: AddUnit) =>
      authApi.patch(`/v1/units/${id}/`, formData),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['unit', id] });
    },
  });

  const onSubmit = async (formData: AddUnit) => {
    updateUnitMutation.mutate(formData);

    toast.success('Unit updated successfully');
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
            <PageTitle
              title={`Edit unit - ${data.name}`}
              subtitle='Complete the form to modify this unit'
            />
            <UnitForm
              unit={data}
              onSubmit={onSubmit}
            />
          </>
        ) : (
          <div>Unit data not found</div>
        )}
      </div>
    </PageTransition>
  );
};
