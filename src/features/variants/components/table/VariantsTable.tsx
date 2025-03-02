import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import {
  ColumnDef,
  flexRender,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useAuthApi } from '@/hooks/use-auth-api';

import { DataTablePagination } from '@/components/shared';
import { ProductVariant } from '@/features/variants/types';

interface VariantsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

type PaginationState = {
  pageSize: number;
  pageIndex: number;
};

export function VariantsTable<TData, TValue>({
  columns,
}: VariantsTableProps<TData, TValue>) {
  const authApi = useAuthApi();
  const queryClient = useQueryClient();

  const [rowSelection, setRowSelection] = useState({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRowsIds, setSelectedRowsIds] = useState<number[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const throttledSearch = debounce((value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, 500);

  const fetchVariants = async (
    pagination: PaginationState,
    search?: string,
    sorting?: SortingState
  ) => {
    const { pageIndex, pageSize } = pagination;
    const offset = pageIndex * pageSize;

    let url = `/v1/variants/?limit=${pageSize}&offset=${offset}`;

    if (search) {
      url += `&search=${search}`;
    }

    if (sorting && sorting.length > 0) {
      const { id, desc } = sorting[0];
      const ordering = desc ? `-${id}` : id;

      url += `&ordering=${ordering}`;
    }

    const response = await authApi.get(url);

    return response.data;
  };

  const fetchVariantsQuery = useQuery({
    queryKey: [
      'variantss',
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      sorting,
    ],
    queryFn: () => fetchVariants(pagination, searchTerm, sorting),
  });

  const table = useReactTable({
    columns,
    manualSorting: true,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    data: fetchVariantsQuery.data?.results || [],
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(fetchVariantsQuery.data?.count / pagination.pageSize),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
    },
  });

  const deleteVariantsMutation = useMutation({
    mutationKey: ['deleteVariants'],
    mutationFn: async (ids: number[]) => {
      await authApi.post(`/v1/variants/bulk-delete/`, { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'variantss',
          pagination.pageIndex,
          pagination.pageSize,
          searchTerm,
          sorting,
        ],
      });

      toast.success('Variants deleted successfully.');

      // Unselect all rows after deleting variants
      table.setRowSelection({});
    },
  });

  const deleteVariants: () => void = () => {
    if (confirm('Are you sure you want to delete the selected variants?')) {
      deleteVariantsMutation.mutate(selectedRowsIds);
    }
  };

  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedRowsIds = selectedRows.map((row) => {
      const variant: ProductVariant = row.original as ProductVariant;
      return variant.id;
    });

    setSelectedRowsIds(selectedRowsIds);
  }, [rowSelection, table]);

  return (
    <div>
      <div className='flex items-center py-4 justify-between'>
        <div>
          <Input
            placeholder='Search products...'
            onChange={(event) => throttledSearch(event.target.value)}
          />
        </div>

        <div className='space-x-2'>
          <Button
            size='sm'
            variant='destructive'
            onClick={deleteVariants}
            disabled={selectedRowsIds.length === 0}
          >
            <Trash />
            <span className='hidden sm:block'>Delete Variants</span>
          </Button>

          <Link to='/variants/add'>
            <Button size='sm'>
              <Plus />
              <span className='hidden sm:block'>Add Variant</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
