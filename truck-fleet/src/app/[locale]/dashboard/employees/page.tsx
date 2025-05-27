import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";
import DriverList from "./components/DriverList";
import ToggleView from "./components/ToggleView";

export default async function DriversPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;

    const {
        locale
    } = params;

    setRequestLocale(locale);

    return (
		<>
			<DriverList />
			<ToggleView />
		</>
	);
}
