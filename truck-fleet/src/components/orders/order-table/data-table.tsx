import { Button } from "@/components/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useOrderIdContext } from "@/context/order-selected-context";
import type { Order } from "@/models/orders";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
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
	const { order: id, setOrder: setId } = useOrderIdContext();
	const t = useTranslations("OrderList");

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),

		initialState: {
			pagination: {
				pageSize: 25, //custom default page size
			},
		},
		enableColumnPinning: true,
		enableMultiRowSelection: false,
		enableRowSelection(row) {
			if (!row.getIsSelected()) {
				setId(row.original as Order);
			} else {
				setId(null);
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
					" whitespace-nowrap overflow-auto w-full min-h-screen h-full pb-[70px]"
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
									draggable
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
