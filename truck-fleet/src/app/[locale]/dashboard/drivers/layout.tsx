import { use } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import BackButton from "./components/BackButton";
import DriverFilter from "./components/DriverFilter";
import InviteCodeInfo from "./components/InviteCode";
import RemoveDriverConfirmationDialog from "./components/RemoveDriverConfirmationDialog";

export default function DriversLayout(props: { params: Promise<{ locale: string }>; children: React.ReactNode }) {
    const params = use(props.params);

    const {
        locale
    } = params;

    const {
        children
    } = props;

    setRequestLocale(locale);

    const t = useTranslations("SidebarLink");
    const t2 = useTranslations("EmployeePage");

    return (
		<div className={"relative flex flex-1 overflow-hidden"}>
			<RemoveDriverConfirmationDialog />
			<Card className="relative w-full flex-1 rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300">
				<CardHeader className="sticky top-0 mb-0 flex flex-row items-center justify-between border-b bg-sidebar">
					<div className="flex flex-col gap-4">
						<BackButton />
						<DriverFilter />
					</div>
					<InviteCodeInfo />
				</CardHeader>
				<div className="relative w-full">{children}</div>
			</Card>
		</div>
	);
}
