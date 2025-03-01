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

import { Unit } from '@/features/taxonomy/types';
import { DataTablePagination } from '@/components/shared';

interface UnitsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

type PaginationState = {
  pageSize: number;
  pageIndex: number;
};

export function UnitsTable<TData, TValue>({
  columns,
}: UnitsTableProps<TData, TValue>) {
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

  const fetchUnits = async (
    pagination: PaginationState,
    search?: string,
    sorting?: SortingState
  ) => {
    const { pageIndex, pageSize } = pagination;
    const offset = pageIndex * pageSize;

    let url = `/v1/units/?limit=${pageSize}&offset=${offset}`;

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

  const fetchUnitsQuery = useQuery({
    queryKey: [
      'units',
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      sorting,
    ],
    queryFn: () => fetchUnits(pagination, searchTerm, sorting),
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
    data: fetchUnitsQuery.data?.results || [],
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(fetchUnitsQuery.data?.count / pagination.pageSize),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
    },
  });

  const deleteUnitsMutation = useMutation({
    mutationKey: ['deleteUnits'],
    mutationFn: async (ids: number[]) => {
      await authApi.post(`/v1/units/bulk-delete/`, { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });

      toast.success(
        `${selectedRowsIds.length} ${
          selectedRowsIds.length === 1 ? 'unit' : 'units'
        } deleted successfully.`
      );

      // Unselect all rows after deleting units
      table.setRowSelection({});
    },
  });

  const deleteUnits: () => void = () => {
    if (confirm('Are you sure you want to delete the selected units?')) {
      deleteUnitsMutation.mutate(selectedRowsIds);
    }
  };

  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedRowsIds = selectedRows.map((row) => {
      const unit: Unit = row.original as Unit;
      return unit.id;
    });

    setSelectedRowsIds(selectedRowsIds);
  }, [rowSelection, table]);

  return (
    <div>
      <div className='flex items-center py-4 justify-between'>
        <div>
          <Input
            className='max-w-sm'
            placeholder='Search units...'
            onChange={(event) => throttledSearch(event.target.value)}
          />
        </div>

        <div className='space-x-2'>
          <Button
            size='sm'
            variant='destructive'
            onClick={deleteUnits}
            disabled={selectedRowsIds.length === 0}
          >
            <Trash />
            <span className='hidden sm:block'>Delete Units</span>
          </Button>

          <Link to='/units/add'>
            <Button
              size='sm'
              className='text-white bg-blue-700'
            >
              <Plus />
              Add Unit
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
