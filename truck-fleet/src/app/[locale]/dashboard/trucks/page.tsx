import { unstable_setRequestLocale } from "next-intl/server";

export default function TruckPage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return <h1>Welcome to page!</h1>;
}
