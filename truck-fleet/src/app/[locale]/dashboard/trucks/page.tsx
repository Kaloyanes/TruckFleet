import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";

export default async function TruckPage({
	params: { locale },
}: { params: { locale: string } }) {
	setRequestLocale(locale);

	return <h1>Welcome to page!</h1>;
}
