import type { Truck } from "@/types/truck";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export const TruckColumns: ColumnDef<Truck>[] = [
	{
		accessorKey: "licensePlate",
		header() {
			const t = useTranslations("TruckList");
			return <span>{t("licensePlate")}</span>;
		},
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
			return <span>{date.toLocaleDateString()}</span>;
		},
	},
];
