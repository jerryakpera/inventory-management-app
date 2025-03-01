import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
import { toast } from 'sonner';

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

import { Category } from '@/features/taxonomy/types';
import { DataTablePagination } from '@/components/shared';

interface CategoriesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

type PaginationState = {
  pageSize: number;
  pageIndex: number;
};

export function CategoriesTable<TData, TValue>({
  columns,
}: CategoriesTableProps<TData, TValue>) {
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

  const fetchCategories = async (
    pagination: PaginationState,
    search?: string,
    sorting?: SortingState
  ) => {
    const { pageIndex, pageSize } = pagination;
    const offset = pageIndex * pageSize;

    let url = `/v1/categories/?limit=${pageSize}&offset=${offset}`;

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

  const fetchCategoriesQuery = useQuery({
    queryKey: [
      'categories',
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      sorting,
    ],
    queryFn: () => fetchCategories(pagination, searchTerm, sorting),
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
    data: fetchCategoriesQuery.data?.results || [],
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(
      fetchCategoriesQuery.data?.count / pagination.pageSize
    ),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
    },
  });

  const deleteCategoriesMutation = useMutation({
    mutationKey: ['deleteCategories'],
    mutationFn: async (ids: number[]) => {
      await authApi.post(`/v1/categories/bulk-delete/`, { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });

      toast.success(
        `${selectedRowsIds.length} ${
          selectedRowsIds.length === 1 ? 'category' : 'categories'
        } deleted successfully.`
      );

      // Unselect all rows after deleting products
      table.setRowSelection({});
    },
  });

  const deleteCategories: () => void = () => {
    if (confirm('Are you sure you want to delete the selected categories?')) {
      deleteCategoriesMutation.mutate(selectedRowsIds);
    }
  };

  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedRowsIds = selectedRows.map((row) => {
      const category: Category = row.original as Category;
      return category.id;
    });

    setSelectedRowsIds(selectedRowsIds);
  }, [rowSelection, table]);

  return (
    <div>
      <div className='flex items-center py-4 justify-between'>
        <div>
          <Input
            className='max-w-sm'
            placeholder='Search categories...'
            onChange={(event) => throttledSearch(event.target.value)}
          />
        </div>

        <div className='space-x-2'>
          <Button
            size='sm'
            variant='destructive'
            onClick={deleteCategories}
            disabled={selectedRowsIds.length === 0}
          >
            <Trash />
            <span className='hidden sm:block'>Delete Products</span>
          </Button>

          <Link to='/categories/add'>
            <Button
              size='sm'
              className='text-white bg-blue-700'
            >
              <Plus />
              Add Category
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

      <div className='mt-2'>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
