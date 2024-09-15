import { unstable_setRequestLocale } from "next-intl/server";

export default function ProfileLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	return <section>{children}</section>;
}
