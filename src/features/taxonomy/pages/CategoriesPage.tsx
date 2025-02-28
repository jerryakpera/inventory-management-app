import { capitalize } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { Category } from '@/features/taxonomy/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const CategoriesPage = () => {
  const authApi = useAuthApi();

  const fetchCategories = async () => {
    const response = await authApi.get('/v1/categories/?limit=100');
    return response.data.results;
  };

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <PageTransition>
      <div className='py-4 sm:py-10 space-y-4'>
        <div>
          <h1 className='text-xl font-bold tracking-wide'>Categories</h1>
          <h3 className='text-sm text-gray-700 font-medium'>
            View and manage the list of categories available in the inventory
          </h3>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {categories?.map((category) => {
            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{capitalize(category.name)}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                {category.image}
                {category.image && (
                  <CardContent>
                    <img src={category.image} />
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};
