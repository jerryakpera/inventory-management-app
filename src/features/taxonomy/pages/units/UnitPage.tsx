import { toast } from 'sonner';
import { capitalize } from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';

import {
  ProductsTable,
  productColumns,
} from '@/features/products/components/table';
import { PageTitle } from '@/components/shared';
import { Unit } from '@/features/taxonomy/types';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { DeleteUnit } from '@/features/taxonomy/components';

export const UnitPage = () => {
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
  });

  const handleUnitDelete = async () => {
    queryClient.invalidateQueries({ queryKey: ['units'] });
    toast.success('Unit deleted successfully');
    navigate('/units');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className='space-y-4'>
        {data ? (
          <>
            <div className='flex justify-end space-x-2'>
              <Link to={`/units/${id}/edit`}>
                <Button
                  size='sm'
                  className='text-white bg-blue-600'
                >
                  Edit
                </Button>
              </Link>
              <DeleteUnit
                unitId={Number(id)}
                onDelete={handleUnitDelete}
              >
                <Button
                  size='sm'
                  variant='destructive'
                >
                  Delete
                </Button>
              </DeleteUnit>
            </div>
            <PageTitle
              title={`${capitalize(data.name)} - ${
                data.product_count
              } product(s)`}
              subtitle={data.symbol}
            />
            <ProductsTable
              columns={productColumns}
              unitId={String(data.id)}
            />
          </>
        ) : (
          <div>Unit data not found</div>
        )}
      </div>
    </PageTransition>
  );
};
