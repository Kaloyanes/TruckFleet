"use client";;
import { use } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import InfoCard from "./components/InfoCard";

export default function InvoicesLayout(
    props: {
        children: React.ReactNode;
        params: Promise<{ locale: string }>;
    }
) {
    const params = use(props.params);

    const {
        locale
    } = params;

    const {
        children
    } = props;

    const t = useTranslations("InvoicesPage");

    return (
		<div
			className={
				"relative mt-5 w-full flex-1 overflow-hidden rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300"
			}
		>
			<div className="mx-5 flex items-center gap-4">
				<InfoCard amount={250000} description={"open"} invoicesCount={5} />
				<InfoCard amount={1500} description={"overdue"} invoicesCount={5} />
				<InfoCard amount={250000} description={"paid"} invoicesCount={5} />

				<Card className="min-h-40 flex-1">
					<CardHeader>
						<CardTitle>Payment Score</CardTitle>
					</CardHeader>
				</Card>
			</div>
			<section className="">{children}</section>
		</div>
	);
}
