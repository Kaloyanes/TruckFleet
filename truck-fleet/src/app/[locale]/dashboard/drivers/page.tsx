import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";
import DriverList from "./components/DriverList";
import ToggleView from "./components/ToggleView";

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
