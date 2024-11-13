import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Order } from "@/models/orders";
import { useOrderOptionsStore } from "@/stores/Orders/OrdersOptionsStore";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import React from "react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export default function OrderDataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const { setOrder } = useOrderOptionsStore();
	const t = useTranslations("OrderList");

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		initialState: {
			pagination: {
				pageSize: 25, //custom default page size
			},
		},
		state: {
			columnFilters: columnFilters,
		},
		enableColumnPinning: true,
		enableMultiRowSelection: false,
		enableRowSelection(row) {
			if (!row.getIsSelected()) {
				setOrder(row.original as Order);
			} else {
				setOrder(null);
			}
			// setId((row.original as any).id);

			return true;
		},

		columnResizeMode: "onChange",
	});

	return (
		<>
			<ScrollArea
				className={
					"h-full min-h-screen w-full overflow-auto whitespace-nowrap pb-[70px]"
				}
			>
				<ScrollBar orientation="vertical" />
				<ScrollBar orientation="horizontal" />
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className={`min-w-[${header.getSize()}px]`}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
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
									className="w-full"
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={`min-w-[${cell.column.getSize()}px]`}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{t("noOrdersFound")}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
					{/* <TableFooter className="w-full flex  items-center justify-end space-x-2 sticky bottom-6 right-6 px-6">
						<Button
							variant="outline"
							size="icon"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<IconArrowLeft />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<IconArrowRight />
						</Button>
					</TableFooter> */}
				</Table>
			</ScrollArea>

			<div className="flex items-center justify-end space-x-2 sticky bottom-6 right-6 px-6">
				<Button
					variant="outline"
					size="icon"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<IconArrowLeft />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<IconArrowRight />
				</Button>
			</div>
		</>
	);
}
