import { Card, CardHeader } from "@/components/ui/card";
import LetterPullup from "@/components/ui/letter-pullup";
import { setRequestLocale } from "next-intl/server";

export default async function InvoicesLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	setRequestLocale(locale);

	return (
		<Card
			className={
				"relative w-full flex-1 overflow-hidden rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300"
			}
		>
			<CardHeader className="sticky bg-sidebar top-0 flex flex-row items-center justify-between border-b select-none">
				<LetterPullup words="Invoices" className="font-semibold" />
			</CardHeader>

			<section className="w-full">{children}</section>
		</Card>
	);
}
