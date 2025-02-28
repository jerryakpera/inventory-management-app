import { useState } from 'react';
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

import { useAuthApi } from '@/hooks/use-auth-api';

import { DataTablePagination } from './DataTablePagination';

interface ProductsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export function ProductsTable<TData, TValue>({
  columns,
}: ProductsTableProps<TData, TValue>) {
  const authApi = useAuthApi();

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchProducts = async (pagination: PaginationState) => {
    const { pageIndex, pageSize } = pagination;

    const offset = pageIndex * pageSize;
    const response = await authApi.get(
      `/v1/products/?limit=${pageSize}&offset=${offset}`
    );

    return response.data;
  };

  const fetchProductsQuery = useQuery({
    queryKey: ['products', pagination.pageIndex, pagination.pageSize],
    queryFn: () => fetchProducts(pagination),
  });

  const table = useReactTable({
    columns,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    data: fetchProductsQuery.data?.results || [],
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(fetchProductsQuery.data?.count / pagination.pageSize),
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
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter products...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
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
