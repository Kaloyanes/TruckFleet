"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { Invoice } from "@/types/invoice";
import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
	IconDotsVertical,
	IconDownload,
	IconEdit,
	IconTrash,
} from "@tabler/icons-react";
import { redirect, useRouter } from "@/lib/navigation";

export const columns: ColumnDef<Invoice>[] = [
	{
		accessorKey: "invoiceNumber",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="flex items-center"
				>
					Invoice Number <ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ getValue }) => {
			return <span className="text-sm capitalize">{getValue() as string}</span>;
		},
	},
	{
		accessorFn: (row) => [row.dueDate, row.dateFormat],
		header: "Due Date",
		cell: ({ getValue }) => {
			const [dueDate, dateFormat] = getValue() as [Date, string];

			return <span className="text-sm">{format(dueDate, dateFormat)}</span>;
		},
	},
	{
		accessorKey: "to",
		header: "To",
		cell: ({ getValue }) => {
			return (
				<span className="text-sm">{(getValue() as string).split("|")[0]}</span>
			);
		},
	},
	{
		accessorFn: (row) => [row.total, row.currencyCode],
		header: "Amount",
		cell: ({ getValue }) => {
			const [value, currencyCode] = getValue() as [number, string];

			const [amount, setAmount] = useState(0);

			useEffect(() => {
				setAmount(value);
			}, [value]);

			return (
				<NumberFlow
					value={amount}
					format={{
						style: "currency",
						currency: currencyCode,
					}}
				/>
			);
		},
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: () => {
			const router = useRouter();

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size={"icon"}>
							<IconDotsVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={(e) => {
								router.push("/dashboard/invoices/1/download");
							}}
							className="flex flex-row gap-2"
						>
							<IconDownload />
							Download
						</DropdownMenuItem>
						<DropdownMenuItem className="flex flex-row gap-2">
							<IconEdit />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem className="flex flex-row gap-2">
							<IconTrash />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
