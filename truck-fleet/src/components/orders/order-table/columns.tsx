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
	IconArrowDown,
	IconArrowsRightDown,
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
import ShowLocations from "./locations";

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
		accessorKey: "id",
		header: "Order ID",
		cell: ({ getValue }) => <span>{getValue() as string}</span>,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ getValue }) => <span>{getValue() as string}</span>,
	},
	{
		accessorKey: "driver",
		header: "Driver",
		cell: ({ getValue }) => {
			const driverRef = getValue() as DocumentReference;
			const [driver] = useDocumentData(
				driverRef.withConverter(driverConverter),
			);
			return (
				<HoverCard openDelay={150}>
					<HoverCardTrigger>{driver?.name}</HoverCardTrigger>
					<HoverCardContent className="w-full">
						<motion.ol
							initial={{ opacity: 0, scale: 0.7, y: -10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: 0.3,
								delay: 0.1,
								type: "spring",
								bounce: 0.2,
								staggerChildren: 0.1,
							}}
							className="flex flex-col gap-2 "
						>
							<li className="text-center text-lg">Driver Details</li>
							<li>Email: {driver?.email}</li>
							<li>Phone: {driver?.phoneNumber}</li>
						</motion.ol>
					</HoverCardContent>
				</HoverCard>
			);
		},
	},
	{
		accessorKey: "truck",
		header: "Truck",
		cell: ({ getValue }) => {
			const truckRef = getValue() as DocumentReference;
			const [truck] = useDocumentData(truckRef.withConverter(truckConverter));
			return (
				<HoverCard openDelay={150}>
					<HoverCardTrigger>{truck?.licensePlate}</HoverCardTrigger>
					<HoverCardContent>
						<motion.div
							initial={{ opacity: 0, scale: 0.7, y: -10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: 0.3,
								delay: 0.1,
								type: "spring",
								bounce: 0.2,
							}}
							className="flex flex-col gap-2"
						>
							<span>
								Model: {truck?.model} {truck?.year}
							</span>
							<span>Status: {truck?.status}</span>
							<span>Capacity: {truck?.capacity}</span>
						</motion.div>
					</HoverCardContent>
				</HoverCard>
			);
		},
	},
	// Company
	{
		accessorKey: "company",
		header: "Company",
		cell: ({ getValue }) => {
			const companyInfo = getValue() as {
				name: string;
				ref: DocumentReference;
				worker: string;
			};
			const [company] = useDocumentData(
				companyInfo.ref.withConverter(companyConverter),
			);
			return (
				<HoverCard openDelay={150}>
					<HoverCardTrigger>{company?.name}</HoverCardTrigger>
					<HoverCardContent>
						<motion.div
							initial={{ opacity: 0, scale: 0.7, y: -10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: 0.3,
								delay: 0.1,
								type: "spring",
								bounce: 0.2,
							}}
							className="flex flex-col gap-2"
						>
							<span>Rating: {company?.rating}</span>
							<span>Worker: {companyInfo.worker}</span>
							<span>
								Email:{" "}
								<Link href={`mailto:${company?.email}`}>{company?.email}</Link>
							</span>
						</motion.div>
					</HoverCardContent>
				</HoverCard>
			);
		},
	},

	// Palletes
	{
		accessorKey: "palletes",
		header: "Palletes",
		cell: ({ getValue }) => {
			const palletes = getValue() as {
				height: number;
				length: number;
				weight: number;
				width: number;
			}[];

			return (
				<Popover>
					<PopoverTrigger>
						<Button size={"icon"} variant={"outline"}>
							<IconArrowDown />
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<motion.div
							initial={{ opacity: 0, scale: 0.7, y: -10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: 0.3,
								delay: 0.1,
								type: "spring",
								bounce: 0.2,
							}}
							className="flex flex-col gap-2"
						>
							{palletes.map((pallete, index) => (
								<span key={index}>
									{index + 1}. {pallete.height}x{pallete.width}x{pallete.length}{" "}
									{pallete.weight}kg
								</span>
							))}
						</motion.div>
					</PopoverContent>
				</Popover>
			);
		},
	},

	// Locations
	{
		accessorFn: (value) => {
			return [...value.pickUps, ...value.deliveries];
		},
		header: "Locations",
		cell({ getValue }) {
			const values = getValue() as {
				address: string;
				start: Date;
				end: Date;
			}[];

			values.sort((a, b) => a.start.getTime() - b.start.getTime());

			return <ShowLocations locations={values} />;
		},
	},

	// documents
	{
		accessorKey: "documents",
		header: "Documents",
		cell: ({ getValue }) => {
			const documents = getValue() as
				| File
				| { name: string; url: string }
				| null;
			if (!documents) {
				return <span>No documents</span>;
			}

			if (documents instanceof File) {
				return <span>Uploading...</span>;
			}

			return (
				<Link href={documents.url} target="_blank" rel="noreferrer">
					<Button variant={"outline"}>{documents.name}</Button>
				</Link>
			);
		},
	},
	// note
	{
		accessorKey: "note",
		header: "Note",
		cell: ({ getValue }) => {
			const note = getValue() as string;

			if (note.length === 0) {
				return <span>No notes</span>;
			}

			return <span>{note}</span>;
		},
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
