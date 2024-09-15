import type {
	DocumentData,
	DocumentReference,
	Timestamp,
} from "firebase/firestore";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useContext, useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useTranslations } from "next-intl";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	IconArrowDown,
	IconArrowsRightDown,
	IconDetails,
	IconEdit,
	IconFilter,
	IconListDetails,
	IconMenu,
	IconMenu2,
	IconMessage,
	IconPhone,
	IconSearch,
	IconTrash,
} from "@tabler/icons-react";
import type { Order } from "@/models/orders";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { truckConverter } from "@/firebase/converters/truckConverter";
import { motion } from "framer-motion";
import { driverConverter } from "@/firebase/converters/driverConverter";
import { companyConverter } from "@/firebase/converters/companyConverter";
import Link from "next/link";
import { useEditOrderContext } from "@/context/orders/order-edit-context";
import { useDeleteOrderContext } from "@/context/orders/order-delete-context";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCopyToClipboard } from "react-use";
import type { Driver } from "@/models/driver";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useDriverToggleViewContext } from "@/context/drivers/driver-toggle-view-context";
import { useRemoveDriverContext } from "@/context/drivers/remove-driver-context";

export const DriverColumns: ColumnDef<Driver>[] = [
	{
		accessorFn: (row) => [row.name, row.photoUrl],
		header: "Name",
		cell: ({ getValue }) => {
			const { view } = useDriverToggleViewContext();
			const [name, photoUrl] = getValue() as [string, string];

			return (
				<div
					className={`flex items-center gap-2  ${view === "grid" ? "flex-col" : ""}`}
				>
					<Avatar className={`${view === "grid" ? "w-10 h-10" : ""}`}>
						<AvatarImage src={photoUrl} alt={name} />
						<AvatarFallback>
							{(name as string)
								?.split(" ")
								.map((name) => name[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
					<span>{name}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ getValue }) => {
			return <span>{getValue() as string}</span>;
		},
	},
	{
		accessorKey: "phone",
		header: "Phone",
		cell: ({ getValue }) => {
			return <span>{getValue() as string}</span>;
		},
	},
	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => {
			const { view } = useDriverToggleViewContext();
			const { setConfirm, setDriver } = useRemoveDriverContext();

			return (
				<div className="flex gap-2">
					<Button variant="outline" size="icon">
						<IconPhone />
					</Button>
					<Button variant="outline" size="icon">
						<IconMessage />
					</Button>
					<Button
						variant="outline"
						className="bg-red-500/15 hover:bg-red-500/50 border-red-500/50 text-red-800 dark:text-red-200"
						size="icon"
						onClick={() => {
							setConfirm(true);
							setDriver(row.original);
						}}
					>
						<IconTrash />
					</Button>
				</div>
			);
		},
	},
];
