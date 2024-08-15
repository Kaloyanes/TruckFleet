import type {
	DocumentData,
	DocumentReference,
	Timestamp,
} from "firebase/firestore";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useContext, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useTranslations } from "next-intl";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	IconDetails,
	IconEdit,
	IconListDetails,
	IconMenu,
	IconMenu2,
} from "@tabler/icons-react";
import {
	OrderSelectedContext,
	useOrderIdContext,
} from "@/context/order-selected-context";

export type Order = {
	id: string;
	size: string;
	sum: number;
	weight: number;
	status: string;
	customerInfo: {
		customerRef: DocumentData;
		orderId: string;
		worker: string;
	};
	documents: { link: string; name: string }[];
	driver: DocumentData;
	truck: DocumentData;
	pickUps: {
		address: string;
		start: Timestamp;
		end: Timestamp;
	}[];
	deliveries: {
		address: string;
		start: Timestamp;
		end: Timestamp;
	}[];
	note: string;
	createdAt: Timestamp;
};

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: "select",
		header: "",
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		size: 50,
		id: "select",
	},

	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button size={"icon"} variant={"outline"}>
							<IconMenu2 />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[150px]" align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex justify-between">
							Edit
							<IconEdit />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								row.toggleSelected(!row.getIsSelected());
							}}
							className="flex justify-between"
						>
							View Details
							<IconListDetails />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
