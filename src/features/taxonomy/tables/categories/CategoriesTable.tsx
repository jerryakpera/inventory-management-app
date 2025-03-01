import { useState } from 'react';
import { debounce } from 'lodash';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

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

  const [rowSelection, setRowSelection] = useState({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
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

  return (
    <div>
      <div className='flex items-center py-4 justify-between'>
        <Input
          placeholder='Search categories...'
          onChange={(event) => throttledSearch(event.target.value)}
          className='max-w-sm'
        />

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
