import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  SortingState,
  getCoreRowModel,
  Row,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  IoArrowDown,
  IoArrowUp,
  IoEllipsisVertical,
} from "react-icons/io5";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnFilter {
  id: string;
  value: unknown;
}

type ColumnFiltersState = ColumnFilter[];

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  modalTitle?: string;
  onDelete: (row: TData) => void;
  renderModalContent?: (row: TData) => React.ReactNode;
  onRowClick?: (row: TData) => void;
  isAdmin?: boolean; // Add isAdmin prop
}

function getAccessorKey<TData>(column: ColumnDef<TData>): string | undefined {
  if (column && typeof column === "object" && "accessorKey" in column) {
    return (column as { accessorKey?: string }).accessorKey;
  }
  return undefined;
}

export function DataTable<TData>({
  columns,
  data,
  modalTitle,
  onDelete,
  renderModalContent,
  onRowClick,
  isAdmin = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TData | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Status badge styling
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Upcoming":
      case "good":
        return "text-[#3F33BD] px-2 rounded-full w-fit";
      case "Ongoing":
      case "fair":
        return "text-[#BD6733] px-2 rounded-full w-fit";
      case "Excellent":
      case "completed":
        return "text-[#1A8F63] px-2 rounded-full w-fit";
      case "Past-due":
      case "maintenance":
        return "text-[#515352] px-2 rounded-full w-fit";
      case "Flagged":
      case "bad":
        return "text-[#D22727] px-2 rounded-full w-fit";
      default:
        return "text-gray-800 px-2 rounded-full w-fit";
    }
  };

  const renderStatusCell = (value: unknown) => {
    const status = String(value);
    return <div className={getStatusClasses(status)}>{status}</div>;
  };

  // Enhance status column with styled badges
  const enhancedColumns = useMemo(() => {
    return columns.map((col) => {
      const accessorKey = getAccessorKey(col);
      const id = col.id;

      if (accessorKey === "status" || id === "status" || accessorKey === "IssueStause" || id === "IssueStause") {
        return {
          ...col,
          cell: ({ row }: { row: Row<TData> }) => {
            const value = accessorKey
              ? row.getValue(accessorKey)
              : id
              ? row.getValue(id)
              : "";
            return renderStatusCell(value);
          },
        };
      }

      return col;
    });
  }, [columns]);

  const tableInstance = useReactTable({
    data,
    columns: enhancedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Row click: modal or custom handler
  const handleRowClick = (rowData: TData) => {
    if (onRowClick) {
      onRowClick(rowData);
    } else {
      setSelectedRow(rowData);
      setModalOpen(true);
    }
  };

  const handleSort = (columnId: string) => {
    const isDesc = sorting[0]?.id === columnId && sorting[0]?.desc;
    setSorting([{ id: columnId, desc: !isDesc }]);
  };

  const handleDeleteClick = (e: React.MouseEvent, row: TData) => {
    e.stopPropagation();
    onDelete(row);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer select-none"
                    onClick={() => handleSort(header.column.id)}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {/* Sorting Icon */}
                    {sorting.find((s) => s.id === header.column.id) ? (
                      sorting.find((s) => s.id === header.column.id)!.desc ? (
                        <IoArrowDown className="inline-block ml-2" />
                      ) : (
                        <IoArrowUp className="inline-block ml-2" />
                      )
                    ) : (
                      <span className="ml-2 opacity-30">
                        <IoArrowUp className="inline-block" />
                      </span>
                    )}
                  </TableHead>
                ))}
                {/* Conditionally render Actions table head */}
                {isAdmin && (
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {tableInstance.getPaginationRowModel().rows.length ? (
              tableInstance.getPaginationRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  className="cursor-pointer hover:bg-gray-100 capitalize"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {/* Conditionally render Actions cell */}
                  {isAdmin && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="sr-only">Open menu</span>
                            <IoEllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteClick(e, row.original)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={enhancedColumns.length + (isAdmin ? 1 : 0)} // Adjust colspan based on admin status
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => tableInstance.previousPage()}
          disabled={!tableInstance.getCanPreviousPage()}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: tableInstance.getPageCount() }, (_, i) => (
            <Button
              key={i}
              variant={
                i === tableInstance.getState().pagination.pageIndex
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => tableInstance.setPageIndex(i)}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => tableInstance.nextPage()}
          disabled={!tableInstance.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Modal */}
      {!onRowClick && ( // Only show modal if routing is not being used
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="p-0">
            <DialogHeader className="border-b p-4">
              <DialogTitle>{modalTitle}</DialogTitle>
            </DialogHeader>

            {selectedRow && (
              <div className="space-y-2 p-4">
                {renderModalContent ? (
                  renderModalContent(selectedRow)
                ) : (
                  <div className="bg-[#FFF8FF] rounded border border-[#FFE5F0] p-2">
                    {Object.entries(selectedRow).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
