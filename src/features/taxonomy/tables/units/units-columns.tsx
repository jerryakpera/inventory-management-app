import _ from 'lodash';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { RowActions } from './RowActions';
import { Unit } from '@/features/taxonomy/types';

export const unitsColumns: ColumnDef<Unit>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label='Select row'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const unit = row.original;

      const name = row.getValue('name') as string;
      const formattedName = _.capitalize(name);

      return (
        <Link
          to={`/units/${unit.id}`}
          className='text-left font-semibold cursor-pointer text-blue-600 duration-75 hover:text-blue-700'
        >
          {formattedName}
        </Link>
      );
    },
  },
  {
    accessorKey: 'symbol',
    header: () => <div className='font-medium'>Symbol</div>,
  },
  {
    accessorKey: 'product_count',
    header: () => <div className='font-medium'>Products</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const unit = row.original;
      return (
        <div className='text-right'>
          <RowActions unit={unit} />
        </div>
      );
    },
  },
];
