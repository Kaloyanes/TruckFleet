"use client";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import NumberFlow from "@number-flow/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface InfoCardProps {
	amount: number;
	description: string;
	invoicesCount: number;
}

export default function InfoCard({
	amount,
	description,
	invoicesCount,
}: InfoCardProps) {
	const locale = useLocale();
	const t = useTranslations("InvoicesPage");
	const [count, setCount] = useState(amount);
	const [invoices, setInvoicesCount] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCount(Math.round(Math.random() * 15000));
		}, 1000);

		return () => clearInterval(interval);
	});

	useEffect(() => {
		setTimeout(() => {
			setInvoicesCount(invoicesCount);
		}, 200);
	}, [invoicesCount]);

	return (
		<Card className="min-h-40 flex-1">
			<CardHeader className="border-none mb-0">
				<CardTitle>
					<NumberFlow
						value={count}
						className="font-semibold text-xl/4xl"
						format={{
							style: "currency",
							currency: "EUR",
							compactDisplay: "short",
						}}
					/>
				</CardTitle>
				<h2 className="font-semibold">{t(description as any)}</h2>
				<CardDescription className="font-semibold text-xl/4xl">
					<NumberFlow value={invoices} className="font-semibold text-xl/4xl" />{" "}
					{t("invoices")}
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
