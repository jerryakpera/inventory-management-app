import _ from 'lodash';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { RowActions } from './RowActions';
import { Product } from '@/features/products/types';

export const productColumns: ColumnDef<Product>[] = [
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
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
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
      const name = row.getValue('name') as string;
      const formattedName = _.capitalize(name);
      return <div className='text-left font-medium'>{formattedName}</div>;
    },
  },
  {
    accessorKey: 'variant_count',
    header: () => <div className='font-medium'>Variants</div>,
  },
  {
    accessorKey: 'category_name',
    header: () => <div className='font-medium'>Category</div>,
    cell: ({ row }) => {
      const category = row.getValue('category_name') as string;
      const formattedCategory = _.capitalize(category);

      return <div className='text-left font-medium'>{formattedCategory}</div>;
    },
  },
  {
    accessorKey: 'updated',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const updated = row.getValue('updated') as string;
      const updatedAt = new Date(updated);
      const formattedDate = format(updatedAt, 'MMM dd, yyyy');

      return <div className='text-left font-medium'>{formattedDate}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      return <RowActions product={product} />;
    },
  },
];
