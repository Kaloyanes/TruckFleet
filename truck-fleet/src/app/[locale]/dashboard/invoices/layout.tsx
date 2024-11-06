"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import LetterPullup from "@/components/ui/letter-pullup";
import { IconCirclePlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default async function InvoicesLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const t = useTranslations("InvoicesPage");
	return (
		<Card
			className={
				"relative w-full flex-1 overflow-hidden rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300"
			}
		>
			<CardHeader className="sticky top-0 flex select-none flex-row items-center justify-between border-b bg-sidebar">
				<LetterPullup words={t("invoices")} className="font-semibold" />
				<Button
					variant="expandIcon"
					Icon={IconCirclePlus}
					iconPlacement="right"
					className="motion-preset-blur-left-lg font-bold"
				>
					{t("newInvoice")}
				</Button>
			</CardHeader>

			<section className="">{children}</section>
		</Card>
	);
}
