import {
  CategoriesTable,
  categoryColumns,
} from '@/features/taxonomy/tables/categories';
import { PageTitle } from '@/components/shared';
import { PageTransition } from '@/components/theme';

export const CategoriesPage = () => {
  return (
    <PageTransition>
      <div className='py-4 sm:py-10 space-y-4'>
        <PageTitle
          title='Categories'
          subtitle='View and manage the list of categories available in the inventory'
        />

        <CategoriesTable columns={categoryColumns} />
      </div>
    </PageTransition>
  );
};
