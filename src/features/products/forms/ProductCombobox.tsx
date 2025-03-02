'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type Product = {
  id: number;
  name: string;
};

interface ProductSelectorProps {
  products: Product[];
  onSelect: (id: number) => void;
  selectedId?: number | null;
}

export function ProductCombobox({
  products,
  onSelect,
  selectedId,
}: ProductSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedProduct = products.find((product) => product.id === selectedId);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          {selectedProduct ? selectedProduct.name : 'Select product...'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput
            placeholder='Search product...'
            className='h-9'
          />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.id.toString()}
                  onSelect={() => {
                    onSelect(product.id);
                    setOpen(false);
                  }}
                >
                  {product.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedId === product.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
