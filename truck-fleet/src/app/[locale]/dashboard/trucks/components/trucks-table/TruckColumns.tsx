import type { Truck } from "@/types/truck";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	IconGraphFilled,
	IconEdit,
	IconTrash,
	IconDotsVertical,
	IconListDetails,
	IconFilter,
} from "@tabler/icons-react";
// Import dropdown menu components from your UI library
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion } from "motion/react";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/DropdownMenuVariants";
import { cn } from "@/lib/utils";
import { useTruckStore } from "@/stores/Trucks/TrucksStore";
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export const TruckColumns: ColumnDef<Truck>[] = [
	{
		accessorKey: "licensePlate",
		header({ column }) {
			const t = useTranslations("TruckList");
			return (
				<div className="flex items-center gap-2">
					<span>{t("licensePlate")}</span>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="ghost" size="icon" className="h-6 w-6">
								<IconFilter className="h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-72 p-2">
							<Input
								value={(column.getFilterValue() as string) ?? ""}
								onChange={(event) => column.setFilterValue(event.target.value)}
								placeholder={t("filterLicensePlate")}
								className="h-8"
							/>
						</PopoverContent>
					</Popover>
				</div>
			);
		},
		filterFn: "includesString",
	},
	{
		accessorKey: "model",
		header() {
			const t = useTranslations("TruckList");
			return <span>{t("model")}</span>;
		},
	},
	{
		accessorKey: "capacity",
		header() {
			const t = useTranslations("TruckList");
			return <span>{t("capacity")}</span>;
		},
		cell: ({ getValue }) => <span>{`${getValue()} kg`}</span>,
	},
	{
		accessorKey: "status",
		header() {
			const t = useTranslations("TruckList");
			return <span>{t("status")}</span>;
		},
		cell: ({ getValue }) => {
			const status = getValue() as string;
			const t = useTranslations("TruckList");
			return <span>{t(status.replaceAll(" ", "") as any)}</span>;
		},
	},
	{
		accessorKey: "year",
		header() {
			const t = useTranslations("TruckList");
			return <span>{t("year")}</span>;
		},
	},
	{
		accessorKey: "createdAt",
		header() {
			const t = useTranslations("TruckList");
			return <span>{t("createdAt")}</span>;
		},
		cell: ({ getValue }) => {
			const date = getValue() as Date;
			return <span>{format(date, "dd/MM/yyyy")}</span>;
		},
	},
	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => {
			const { deleteTruckDialog, editTruckDialog } = useTruckStore();
			const t = useTranslations("OrderList");

			const actions = [
				{
					label: "actions",
					type: "label",
				},
				{
					type: "seperator",
				},
				{
					type: "button",
					label: "details",
					icon: IconListDetails,
					onClick: () => {
						row.toggleSelected(!row.getIsSelected());
					},
				},
				{
					type: "button",
					label: "edit",
					icon: IconEdit,
					onClick: () => {
						editTruckDialog(row.original.id);
					},
				},
				{
					type: "seperator",
				},
				{
					danger: true,
					type: "button",
					label: "delete",
					icon: IconTrash,
					onClick: () => {
						deleteTruckDialog(row.original.id);
					},
				},
			];

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size={"icon"} variant={"outline"}>
							<IconDotsVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[150px]" align="end">
						<motion.div
							key={row.id}
							variants={dropdownMenuParentVariants}
							initial="hidden"
							animate="visible"
						>
							{actions.map((action, index) => {
								return (
									<motion.div key={index} variants={dropdownMenuVariants}>
										{action.type === "label" && (
											<DropdownMenuLabel key={index}>
												{t(action.label as any)}
											</DropdownMenuLabel>
										)}

										{action.type === "seperator" && (
											<DropdownMenuSeparator key={index} />
										)}

										{action.type === "button" && (
											<DropdownMenuItem
												key={index}
												onClick={action.onClick}
												className={cn(
													"flex justify-between gap-2",
													action.danger
														? "flex gap-2 border-red-500/50 bg-red-500/5 text-red-800 hover:bg-red-500/50 focus:bg-red-500/50 dark:text-red-200"
														: "",
												)}
											>
												{t(action.label as any)}
												{action.icon && <action.icon />}
											</DropdownMenuItem>
										)}
									</motion.div>
								);
							})}
						</motion.div>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
