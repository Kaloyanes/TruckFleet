"use client";
import { use } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import InfoCard from "./components/InfoCard";
import DeleteInvoiceDialog from "./components/DeleteInvoiceDialog";

export default function InvoicesLayout(props: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const params = use(props.params);

	const { locale } = params;

	const { children } = props;

	return (
		<>
			<DeleteInvoiceDialog />
			<div
				className={
					"relative mt-5 w-full flex-1 overflow-hidden rounded-none bg-background backdrop-saturate-150 transition-all duration-300"
				}
			>
				<div className="mx-5 flex items-center gap-4">
					<InfoCard amount={0} description={"pending"} invoicesCount={5} />
					<InfoCard amount={0} description={"overdue"} invoicesCount={5} />
					<InfoCard amount={0} description={"paid"} invoicesCount={5} />
				</div>
				<section className="">{children}</section>
			</div>
		</>
	);
}
