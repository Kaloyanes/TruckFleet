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
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	IconDotsVertical,
	IconDownload,
	IconEdit,
	IconTrash,
	IconMenu2,
	IconListDetails,
} from "@tabler/icons-react";
import Link from "next/link";
import useCompanyId from "@/hooks/useCompanyId";
import { useInvoiceValuesStore } from "@/stores/Invoices/AddInvoiceValuesStore";
import { motion } from "motion/react";
import { cn } from "@/lib/Utils";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/DropdownMenuVariants";
import { useTranslations } from "next-intl";
import { useInvoicesStore } from "@/stores/Invoices/InvoicesStore";
import { useRouter } from "@/i18n/routing";

export const InvoiceColumns: ColumnDef<Invoice>[] = [
	{
		accessorKey: "invoiceNumber",
		header: ({ column }) => {
			const t = useTranslations("InvoiceList");
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="flex items-center"
				>
					{t("invoiceNumber")} <ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			const t = useTranslations("InvoiceList");
			return <span>{t("status")}</span>;
		},
		cell: ({ getValue }) => {
			const t = useTranslations("InvoiceList");
			const status = getValue() as string;
			return <span className="text-sm capitalize">{t(status as any)}</span>;
		},
	},
	{
		id: "date",
		accessorFn: (row) => [row.dueDate, row.dateFormat],
		header: ({ column }) => {
			const t = useTranslations("InvoiceList");
			return <span>{t("dueDate")}</span>;
		},
		cell: ({ getValue }) => {
			const [dueDate, dateFormat] = getValue() as [Date, string];

			return <span className="text-sm">{format(dueDate, dateFormat)}</span>;
		},
	},
	{
		accessorKey: "to",
		header: ({ column }) => {
			const t = useTranslations("InvoiceList");
			return <span>{t("to")}</span>;
		},
		cell: ({ getValue }) => {
			return (
				<span className="text-sm">{(getValue() as string).split("|")[0]}</span>
			);
		},
	},
	{
		id: "amount",
		accessorFn: (row) => [row.total, row.currencyCode],
		header: ({ column }) => {
			const t = useTranslations("InvoiceList");
			return <span>{t("amount")}</span>;
		},
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
		header: "",
		cell: ({ row }) => {
			const invoiceData = row.original;
			const { companyId } = useCompanyId();
			const { setDialogVisibility, setInvoice } = useInvoicesStore();
			const t = useTranslations("InvoiceList");
			const router = useRouter();

			const actions = [
				{
					label: t("actions"),
					type: "label",
				},
				{
					type: "seperator",
				},
				{
					type: "button",
					label: t("download_pdf"),
					icon: IconDownload,
					onClick: () => {
						// row.toggleSelected(!row.getIsSelected());
						// router.push("/dashboard/invoices/download", {
						// 	query: { id: invoiceData.id, companyId: companyId },
						// });
						router.push({
							pathname: "/dashboard/invoices/download",
							query: { id: invoiceData.id, companyId: companyId },
						});
					},
				},
				{
					type: "button",
					label: t("edit"),
					icon: IconEdit,
					onClick: async () => {
						if (companyId)
							await useInvoiceValuesStore
								.getState()
								.startEditing(companyId, invoiceData.id);
					},
				},
				{
					type: "seperator",
				},
				{
					danger: true,
					type: "button",
					label: t("delete"),
					icon: IconTrash,
					onClick: () => {
						setDialogVisibility(true);
						setInvoice(invoiceData);
					},
				},
			];

			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button size="icon" variant="outline">
							<IconDotsVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[150px]" align="end">
						<motion.div
							variants={dropdownMenuParentVariants}
							initial="hidden"
							animate="visible"
						>
							{actions.map((action) => (
								<motion.div key={action.icon} variants={dropdownMenuVariants}>
									{action.type === "label" && (
										<DropdownMenuLabel>{action.label}</DropdownMenuLabel>
									)}
									{action.type === "seperator" && <DropdownMenuSeparator />}
									{action.type === "button" && (
										<DropdownMenuItem
											onClick={action.onClick}
											className={cn(
												"flex justify-between gap-2",
												action.danger
													? "border-red-500/50 bg-red-500/5 text-red-800 hover:bg-red-500/50 focus:bg-red-500/50 dark:text-red-200"
													: "",
											)}
										>
											{action.label}
											{action.icon && <action.icon />}
										</DropdownMenuItem>
									)}
								</motion.div>
							))}
						</motion.div>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
