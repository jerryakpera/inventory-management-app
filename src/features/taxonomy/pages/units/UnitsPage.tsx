import { PageTitle } from '@/components/shared';
import { PageTransition } from '@/components/theme';
import { UnitsTable, unitsColumns } from '@/features/taxonomy/tables/units';

export const UnitsPage = () => {
  return (
    <PageTransition>
      <div className='py-4 sm:py-10 space-y-4'>
        <PageTitle
          title='Units'
          subtitle='View and manage the list of units available for products'
        />

        <UnitsTable columns={unitsColumns} />
      </div>
    </PageTransition>
  );
};
