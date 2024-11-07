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

	useEffect(() => {
		const interval = setInterval(() => {
			setCount(Math.round(Math.random() * 15000));
		}, 1000);

		return () => clearInterval(interval);
	});

	return (
		<Card className="min-h-28 flex-1">
			<CardHeader>
				<CardTitle>
					<NumberFlow
						value={count}
						className="~text-xl/4xl font-semibold"
						format={{
							style: "currency",
							currency: "EUR",
							compactDisplay: "short",
						}}
					/>
				</CardTitle>
				<CardDescription>{t(description as any)}</CardDescription>
			</CardHeader>
		</Card>
	);
}
