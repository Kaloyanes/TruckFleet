"use client";
import { Input } from "@/components/ui/input";
import { useDriverOptionsStore } from "@/stores/Drivers/DriverOptionsStore";
import { useTranslations } from "next-intl";

export default function DriverFilter() {
	const t2 = useTranslations("AddOrderSheet");

	const { setSearch } = useDriverOptionsStore();

	return (
		<Input
			placeholder={t2("filterDrivers")}
			onInput={(e) => {
				setSearch(e.currentTarget.value.trim());
			}}
		/>
	);
}
