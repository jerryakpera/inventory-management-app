import { MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { Product } from '@/features/products/types';

type Props = {
  product: Product;
};

export const RowActions = ({ product }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem className='cursor-pointer'>
          View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer'>
          Edit details
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer'>
          Add product variant
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
