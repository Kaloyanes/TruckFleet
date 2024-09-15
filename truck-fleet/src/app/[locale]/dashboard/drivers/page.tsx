import DriverList from "@/components/drivers/DriverList";
import ToggleView from "@/components/drivers/ToggleView";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default function DriversPage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return (
		<>
			<DriverList />
			<ToggleView />
		</>
	);
}
