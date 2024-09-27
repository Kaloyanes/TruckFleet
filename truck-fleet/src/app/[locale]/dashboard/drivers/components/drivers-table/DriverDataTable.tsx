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
import { useDriverFilterInputContext } from "@/context/drivers/driver-filter-input-context";
import { useDriverToggleViewContext } from "@/context/drivers/driver-toggle-view-context";
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
import React, { useEffect } from "react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export default function DriverDataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const { view, setView } = useDriverToggleViewContext();

	const t = useTranslations("OrderList");
	const t2 = useTranslations("EmployeePage");

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

		columnResizeMode: "onChange",
	});

	if (view === "grid") {
		return (
			<div className="grid h-full min-h-screen w-full grid-flow-row grid-cols-6 grid-rows-4 gap-4 overflow-auto p-4 pb-[70px]">
				{table.getRowModel().rows.map((row) => (
					<div
						key={row.id}
						className="col-span-1 flex flex-col items-center gap-2 rounded-lg bg-black/20 p-5"
					>
						{row.getVisibleCells().map((cell) => (
							<div key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</div>
						))}
					</div>
				))}
			</div>
		);
	}

	const { search } = useDriverFilterInputContext();

	useEffect(() => {
		table.setGlobalFilter(search);
	}, [search, table]);

	return (
		<>
			<ScrollArea
				className={
					"h-full min-h-screen w-full overflow-auto whitespace-nowrap pb-[70px] "
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
							table.getRowModel().rows.map((row, rowIndex) => {
								const previousRow = table.getRowModel().rows[rowIndex - 1];
								const isDifferentType =
									previousRow &&
									(row.original as any).type !==
										(previousRow.original as any).type;

								const isFirstRow = rowIndex === 0;

								return (
									<React.Fragment key={row.id}>
										{(isFirstRow || isDifferentType) && (
											<TableRow className="sticky top-0 w-full ">
												<TableCell
													colSpan={columns.length}
													className="font-bold text-xl"
												>
													{t2(`${`${(row.original as any).type}s`}` as any)}
												</TableCell>
											</TableRow>
										)}
										<TableRow
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
									</React.Fragment>
								);
							})
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{t("noEmployeesFound")}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</ScrollArea>

			<div className="sticky right-6 bottom-6 flex items-center justify-end space-x-2 px-6">
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
