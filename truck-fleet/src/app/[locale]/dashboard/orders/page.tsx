import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";

export default async function OrdersPage({
	params: { locale },
}: { params: { locale: string } }) {
	setRequestLocale(locale);

	return <></>;
}
