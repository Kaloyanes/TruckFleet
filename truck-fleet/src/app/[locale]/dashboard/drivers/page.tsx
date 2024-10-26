import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";
import DriverList from "./components/DriverList";
import ToggleView from "./components/ToggleView";

export default async function DriversPage({
	params: { locale },
}: { params: { locale: string } }) {
	setRequestLocale(locale);

	return (
		<>
			<DriverList />
			<ToggleView />
		</>
	);
}
