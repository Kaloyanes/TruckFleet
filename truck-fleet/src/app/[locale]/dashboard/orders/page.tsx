import { unstable_setRequestLocale } from "next-intl/server";

export default function OrdersPage({ params }: { params: { locale: string } }) {
	unstable_setRequestLocale(params.locale);
	return <></>;
}
