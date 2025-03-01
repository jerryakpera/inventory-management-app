import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { PageTitle } from '@/components/shared';
import { useAuthApi } from '@/hooks/use-auth-api';
import { PageTransition } from '@/components/theme';
import { Category } from '@/features/taxonomy/types';
import { CategoryItem } from '@/features/taxonomy/components';

export const CategoriesPage = () => {
  const authApi = useAuthApi();

  const fetchCategories = async () => {
    const response = await authApi.get('/v1/categories/?limit=100');
    return response.data.results;
  };

  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>(data || []);

  useEffect(() => {
    if (!data) return;
    if (!search) {
      setCategories(data);
      return;
    }

    const filteredCategories = data.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );

    setCategories(filteredCategories);
  }, [search, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className='py-4 sm:py-10 space-y-4'>
        <div className='flex justify-between items-center'>
          <PageTitle
            title='Categories'
            subtitle='View and manage the list of categories available in the inventory'
          />

          <Button>
            <Plus />
            <span className='hidden md:block'>Add Category</span>
          </Button>
        </div>

        <div>
          <Input
            value={search}
            placeholder='search categories'
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories?.map((category) => {
            return (
              <CategoryItem
                key={category.id}
                category={category}
              />
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};
