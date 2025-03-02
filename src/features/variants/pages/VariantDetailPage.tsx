import { toast } from 'sonner';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { noImage } from '@/assets/images';

import { Button } from '@/components/ui/button';

import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { ProductVariant } from '@/features/variants/types';
import { DeleteVariant } from '@/features/variants/components/DeleteVariant';

export const VariantDetailPage = () => {
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<ProductVariant>({
    queryKey: ['variant', id],
    queryFn: async () => {
      const response = await authApi.get(`/v1/variants/${id}/`);
      return response.data;
    },
  });

  const handleVariantDelete = async () => {
    queryClient.invalidateQueries({ queryKey: ['variants'] });
    toast.success('Variant deleted successfully');
    navigate('/variants');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const variantName = `${data?.product?.name} - ${data?.size}${data?.product?.unit_symbol}`;

  return (
    <PageTransition>
      <div className='space-y-4'>
        {data ? (
          <div className='space-y-6'>
            <div className='flex justify-end space-x-2'>
              <Link to={`/variants/${id}/edit`}>
                <Button
                  size='sm'
                  className='text-white bg-blue-600'
                >
                  Edit
                </Button>
              </Link>
              <DeleteVariant
                variantId={Number(id)}
                onDelete={handleVariantDelete}
              >
                <Button
                  size='sm'
                  variant='destructive'
                >
                  Delete
                </Button>
              </DeleteVariant>
            </div>

            <div className='flex flex-col gap-4 md:flex-row items-center'>
              <img
                alt={data.name || ''}
                src={data.image || noImage}
                className='w-32 h-32 object-cover rounded-md'
              />
              <PageTitle
                title={variantName}
                tags={data.product?.tags || []}
              />
            </div>

            <div>
              <div className='text-xs font-light text-gray-700 uppercase tracking-wide'>
                Description
              </div>
              <div className='font-medium'>{data.description}</div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              <div>
                <div className='text-xs font-light text-gray-700 uppercase tracking-wide'>
                  Product
                </div>
                <Link
                  to={`/products/${data.product?.id}`}
                  className='font-medium text-blue-600 hover:text-blue-800 duration-75 ease-in-out'
                >
                  {data.product?.name}
                </Link>
              </div>

              <div>
                <div className='text-xs font-light text-gray-700 uppercase tracking-wide'>
                  Size
                </div>
                <div className='font-medium'>
                  {data.size}
                  {data.product?.unit_symbol}{' '}
                </div>
              </div>

              <div>
                <div className='text-xs font-light text-gray-700 uppercase tracking-wide'>
                  Price
                </div>
                <div className='font-medium'>N{data.price}</div>
              </div>

              <div>
                <div className='text-xs font-light text-gray-700 uppercase tracking-wide'>
                  Category
                </div>
                <Link
                  to={`/categories/${data.product?.category}`}
                  className='font-medium text-blue-600 hover:text-blue-800 duration-75 ease-in-out'
                >
                  {data.product?.category_name}
                </Link>
              </div>

              <div>
                <div className='text-xs font-light text-gray-700 uppercase tracking-wide'>
                  Flavor
                </div>
                <div className='font-medium'>{data.flavor || '---'}</div>
              </div>

              <div>
                <div className='text-xs font-light text-gray-700 uppercase tracking-wide'>
                  Is Active
                </div>
                <div className='font-medium flex items-center gap-x-1'>
                  {data.is_active ? (
                    <ToggleLeft className='text-green-700' />
                  ) : (
                    <ToggleRight className='text-black' />
                  )}
                  {data.is_active ? 'Yes' : 'No'}
                </div>
              </div>

              <div>
                <div className='text-xs font-light text-gray-700 uppercase tracking-wide'>
                  Is Deleted
                </div>
                <div className='font-medium flex items-center gap-x-1'>
                  {data.is_deleted ? (
                    <ToggleLeft className='text-green-700' />
                  ) : (
                    <ToggleRight className='text-black' />
                  )}
                  {data.is_active ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Variant data not found</div>
        )}
      </div>
    </PageTransition>
  );
};
