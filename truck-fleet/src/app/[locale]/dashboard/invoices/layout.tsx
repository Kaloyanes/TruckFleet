import { setRequestLocale } from "next-intl/server";

export default async function InvoicesLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	setRequestLocale(locale);

	return <section>{children}</section>;
}
