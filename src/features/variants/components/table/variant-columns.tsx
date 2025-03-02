import _ from 'lodash';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { noImage } from '@/assets/images';
import { RowActions } from './RowActions';
import { ProductVariant } from '@/features/variants/types';

export const variantColumns: ColumnDef<ProductVariant>[] = [
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
    accessorKey: 'image',
    header: () => <div className='font-medium'></div>,
    cell: ({ row }) => {
      const variant = row.original;
      const imageUrl = row.getValue('image') as string;

      return (
        <img
          alt={variant.name}
          src={imageUrl || noImage}
          className='w-10 h-10 rounded-md'
        />
      );
    },
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
      const variant = row.original;
      const name = row.getValue('name') as string;

      const formattedName = `${variant.size}${
        variant.unit ?? ''
      } - ${_.capitalize(name)}`;

      return (
        <Link
          to={`/variants/${variant.id}`}
          className='text-left font-semibold cursor-pointer text-blue-600 duration-75 hover:text-blue-700'
        >
          {formattedName}
        </Link>
      );
    },
  },
  {
    accessorKey: 'price',
    header: () => <div className='font-medium'>Price</div>,
  },
  {
    accessorKey: 'flavor',
    header: () => <div className='font-medium'>Flavor</div>,
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
      const variant = row.original;
      return <RowActions variant={variant} />;
    },
  },
];
