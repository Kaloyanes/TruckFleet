import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";

export default async function ProfileLayout({
	params: { locale },
	children,
}: { params: { locale: string }; children: React.ReactNode }) {
	setRequestLocale(locale);
	return <section>{children}</section>;
}
