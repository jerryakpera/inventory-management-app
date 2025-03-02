import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { AddUnit } from '@/features/taxonomy/types';
import { UnitForm } from '@/features/taxonomy/forms';

export const AddUnitPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addUnit = async (formData: AddUnit) => {
    const response = await authApi.post('/v1/units/', formData);
    return response.data;
  };

  const addUnitMutation = useMutation({
    mutationKey: ['add-unit'],
    mutationFn: addUnit,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['units'] });
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

      toast.error('Unit not saved. Please try again.');
    },
  });

  const onSubmit = async (formData: AddUnit) => {
    addUnitMutation.mutate(formData);

    toast.success('Unit added successfully!');
    navigate('/units');
  };

  return (
    <PageTransition>
      <div className='space-y-4'>
        <div>
          <h1 className='text-xl font-bold tracking-wide'>Add Product</h1>
          <h3 className='text-sm text-gray-700 font-medium'>
            Fill in the form to add a new unit to the inventory.
          </h3>
        </div>

        <UnitForm onSubmit={onSubmit} />
      </div>
    </PageTransition>
  );
};
