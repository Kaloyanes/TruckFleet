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
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React, { useEffect } from "react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export default function TruckDataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	// Optionally you can add a view toggle (e.g. grid vs. table) if needed.
	const [view] = React.useState<"table" | "grid">("table");
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
				pageSize: 25,
			},
		},
		state: {
			columnFilters: columnFilters,
		},
		enableColumnPinning: true,
		enableMultiRowSelection: false,
		columnResizeMode: "onChange",
	});

	// useEffect(() => {
	// 	// Optionally update global filter if truck store has one.
	// }, [table]);

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

	return (
		<>
			<ScrollArea className="h-full min-h-screen w-full overflow-auto whitespace-nowrap pb-[70px]">
				<ScrollBar orientation="vertical" />
				<ScrollBar orientation="horizontal" />
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
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
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, rowIndex) => (
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
									No trucks found.
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
					{/* You can insert an icon for previous */}
					&lt;
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{/* You can insert an icon for next */}
					&gt;
				</Button>
			</div>
		</>
	);
}
