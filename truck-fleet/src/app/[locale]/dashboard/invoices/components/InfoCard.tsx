"use client";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useInvoicesStore } from "@/stores/Invoices/InvoicesStore";
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
	const t = useTranslations("InvoiceList");
	const { invoices: invoicesData } = useInvoicesStore();
	const invoicesFiltered = invoicesData.filter(
		(invoice) => invoice.status === description,
	);
	const [invoices, setInvoicesCount] = useState(0);
	const [count, setCount] = useState(amount);

	useEffect(() => {
		setCount(invoicesFiltered.reduce((acc, curr) => acc + curr.total, 0));
	});

	useEffect(() => {
		if (invoicesFiltered.length !== 0)
			setTimeout(() => {
				setInvoicesCount(invoicesFiltered.length);
			}, 200);
	}, [invoicesFiltered.length]);

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
					{invoices !== 0 ? (
						<>
							<NumberFlow
								value={invoices}
								className="font-semibold text-xl/4xl"
							/>{" "}
						</>
					) : (
						<></>
					)}
					{t("invoices", { invoices: invoices })}
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
