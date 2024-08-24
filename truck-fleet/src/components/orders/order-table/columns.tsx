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
	IconListDetails,
	IconMenu,
	IconMenu2,
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
import ShowLocations from "./locations";
import { useEditOrderContext } from "@/context/orders/order-edit-context";
import { useDeleteOrderContext } from "@/context/orders/order-delete-context";

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
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("orderId")}</span>;
		},
		cell: ({ getValue }) => <span>{getValue() as string}</span>,
	},
	{
		accessorKey: "status",
		id: "status",
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("status")}</span>;
		},
		cell: ({ getValue }) => {
			const status = getValue() as string;
			const t = useTranslations("AddOrderSheet");

			return <span>{t(status as any)}</span>;
		},
	},
	{
		accessorKey: "driver",
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("driver")}</span>;
		},
		cell: ({ getValue }) => {
			const driverRef = getValue() as DocumentReference;
			const [driver] = useDocumentData(
				driverRef.withConverter(driverConverter),
			);
			return (
				<HoverCard openDelay={150} closeDelay={0}>
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
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("truck")}</span>;
		},
		cell: ({ getValue }) => {
			const truckRef = getValue() as DocumentReference;
			const [truck] = useDocumentData(truckRef.withConverter(truckConverter));
			return (
				<HoverCard openDelay={150} closeDelay={0}>
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
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("company")}</span>;
		},
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
				<HoverCard openDelay={150} closeDelay={0}>
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
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("palletes")}</span>;
		},
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
		id: "locations",
		accessorFn: (value) => {
			return [...value.pickUps, ...value.deliveries];
		},
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("locations")}</span>;
		},
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
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("documents")}</span>;
		},
		cell: ({ getValue }) => {
			const documents = getValue() as { name: string; url: string } | null;
			if (!documents) {
				return <span>No documents</span>;
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
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("note")}</span>;
		},
		cell: ({ getValue }) => {
			const note = getValue() as string;

			if (note.length === 0) {
				return <span>No notes</span>;
			}

			return (
				<HoverCard openDelay={150} closeDelay={0}>
					<HoverCardTrigger>
						<span>{note.length > 50 ? `${note.slice(0, 50)}...` : note}</span>
					</HoverCardTrigger>
					<HoverCardContent className="h-full whitespace-normal">
						{note}
					</HoverCardContent>
				</HoverCard>
			);
		},
	},
	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => {
			const { setOpen, setOrder } = useEditOrderContext();
			const { setConfirm, setOrder: setOrderConfirm } = useDeleteOrderContext();

			const t = useTranslations("OrderList");

			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button size={"icon"} variant={"outline"}>
							<IconMenu2 />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[150px]" align="end">
						<DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								row.toggleSelected(!row.getIsSelected());
							}}
							className="flex justify-between"
						>
							{t("details")}
							<IconListDetails />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								setOrder(row.original);
								setOpen(true);
							}}
							className="flex justify-between"
						>
							{t("edit")}
							<IconEdit />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							color="red"
							className="flex justify-between bg-red-500/15 border-red-500/50 text-red-800 dark:text-red-300"
							onClick={() => {
								setConfirm(true);
								setOrderConfirm(row.original);
							}}
						>
							{t("delete")}
							<IconTrash />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
