import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDriverToggleViewContext } from "@/context/drivers/driver-toggle-view-context";
import { useRemoveDriverContext } from "@/context/drivers/remove-driver-context";
import { useRouter } from "@/lib/navigation";
import type { Driver } from "@/models/driver";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
	IconGraphFilled,
	IconMessage,
	IconPhone,
	IconTrash,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export const DriverColumns: ColumnDef<Driver>[] = [
	{
		accessorFn: (row) => row.name,
		header: "Name",
		enableGlobalFilter: true,

		cell: ({ getValue, row }) => {
			const { view } = useDriverToggleViewContext();
			const name = getValue() as string;

			const photoUrl = row.original.photoUrl;

			return (
				<div
					className={`flex items-center gap-2 ${view === "grid" ? "flex-col" : ""}`}
				>
					<Avatar className={`${view === "grid" ? "h-10 w-10" : ""}`}>
						<AvatarImage src={photoUrl} alt={name} className="object-cover" />
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
		accessorKey: "type",
		header: "Type",
		cell: ({ getValue }) => {
			const t = useTranslations("EmployeePage");
			return <span>{t(getValue() as string as any)}</span>;
		},
	},
	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => {
			const { view } = useDriverToggleViewContext();
			const { setConfirm, setDriver } = useRemoveDriverContext();
			const router = useRouter();
			return (
				<div className="flex justify-end gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							router.push(`/dashboard/drivers/${row.original.id}/stats`);
						}}
					>
						<IconGraphFilled />
					</Button>
					<Button variant="outline" size="icon">
						<IconPhone />
					</Button>
					<Button variant="outline" size="icon">
						<IconMessage />
					</Button>
					<Button
						variant="outline"
						className="border-red-500/50 bg-red-500/15 text-red-800 hover:bg-red-500/50 dark:text-red-200"
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
