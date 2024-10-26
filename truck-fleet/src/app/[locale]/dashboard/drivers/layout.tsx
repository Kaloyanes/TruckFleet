import { Card, CardHeader } from "@/components/ui/card";
import DriverFilterInputContextProvider from "@/context/drivers/driver-filter-input-context";
import DriverToggleViewContextProvider from "@/context/drivers/driver-toggle-view-context";
import RemoveDriverContextProvider from "@/context/drivers/remove-driver-context";
import { useTranslations } from "next-intl";
import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";
import { use } from "react";
import BackButton from "./components/BackButton";
import DriverFilter from "./components/DriverFilter";
import InviteCodeInfo from "./components/InviteCode";
import RemoveDriverConfirmationDialog from "./components/RemoveDriverConfirmationDialog";

export default function DriversLayout({
	params: { locale },
	children,
}: { params: { locale: string }; children: React.ReactNode }) {
	setRequestLocale(locale);

	const t = useTranslations("SidebarLink");
	const t2 = useTranslations("EmployeePage");

	return (
		<RemoveDriverContextProvider>
			<DriverFilterInputContextProvider>
				<RemoveDriverConfirmationDialog />
				<DriverToggleViewContextProvider>
					<div className={"relative flex flex-1 overflow-hidden"}>
						<Card className="relative w-full flex-1 rounded-none border-0 border-border border-l backdrop-saturate-150 transition-all duration-300">
							<CardHeader className="sticky top-0 flex flex-row items-center justify-between border-b">
								<div className="flex flex-col gap-4">
									<BackButton />
									<DriverFilter />
								</div>
								<InviteCodeInfo />
							</CardHeader>
							{/* <CardContent className="p-0 relative overflow-hidden flex-1"> */}

							<div className="relative w-full">{children}</div>
							{/* </CardContent> */}
						</Card>
					</div>
				</DriverToggleViewContextProvider>
			</DriverFilterInputContextProvider>
		</RemoveDriverContextProvider>
	);
}
