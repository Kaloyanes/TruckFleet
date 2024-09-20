"use client";
import { Input } from "@/components/ui/input";
import { useDriverFilterInputContext } from "@/context/drivers/driver-filter-input-context";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

export default function DriverFilter() {
	const t2 = useTranslations("AddOrderSheet");

	const { search, setSearch } = useDriverFilterInputContext();

	return (
		<Input
			placeholder={t2("filterDrivers")}
			onInput={(e) => {
				setSearch(e.currentTarget.value.trim());
			}}
		/>
	);
}
