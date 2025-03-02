import { PageTitle } from '@/components/shared';
import { PageTransition } from '@/components/theme';
import {
  VariantsTable,
  variantColumns,
} from '@/features/variants/components/table';

export const VariantsPage = () => {
  return (
    <PageTransition>
      <div className='space-y-4'>
        <PageTitle
          title='Variants'
          subtitle='View and manage the list of product variants available in the inventory'
        />

        <VariantsTable columns={variantColumns} />
      </div>
    </PageTransition>
  );
};
