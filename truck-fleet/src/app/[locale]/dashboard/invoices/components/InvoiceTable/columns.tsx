"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { Invoice } from "@/types/invoice";

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
			return <span className="text-sm">{getValue() as string}</span>;
		},
	},
	{
		accessorKey: "dueDate",
		header: "Due Date",
		cell: ({ getValue }) => {
			return (
				<span className="text-sm">
					{(getValue() as Date).toLocaleDateString()}
				</span>
			);
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
		accessorKey: "total",
		header: "Amount",
		cell: ({ getValue }) => {
			return <span className="text-sm">{getValue() as string}</span>;
		},
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: () => {
			return (
				<div className="flex items-center space-x-2">
					<Button variant="ghost">View</Button>
					<Button variant="ghost">Edit</Button>
				</div>
			);
		},
	},
];
