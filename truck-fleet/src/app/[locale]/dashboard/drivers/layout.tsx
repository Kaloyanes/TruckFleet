import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DriverToggleViewContextProvider from "@/context/drivers/driver-toggle-view-context";
import RemoveDriverContextProvider from "@/context/drivers/remove-driver-context";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import RemoveDriverConfirmationDialog from "./components/RemoveDriverConfirmationDialog";
import InviteCodeInfo from "./components/InviteCode";

export default function DriversLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const t = useTranslations("SidebarLink");
	const t2 = useTranslations("AddOrderSheet");

	return (
		<RemoveDriverContextProvider>
			<RemoveDriverConfirmationDialog />
			<DriverToggleViewContextProvider>
				<div className={"relative flex flex-1 overflow-hidden"}>
					<Card className="relative w-full flex-1 rounded-none border-0 border-border border-l backdrop-saturate-150 transition-all duration-300">
						<CardHeader className="sticky top-0 flex flex-row items-center justify-between border-b">
							<div className="flex flex-col gap-4">
								<h1 className="font-bold text-2xl">{t("drivers")}</h1>
								<Input placeholder={t2("filterDrivers")} />
							</div>
							<InviteCodeInfo />
						</CardHeader>
						{/* <CardContent className="p-0 relative overflow-hidden flex-1"> */}

						<div className="relative w-full">{children}</div>
						{/* </CardContent> */}
					</Card>
				</div>
			</DriverToggleViewContextProvider>
		</RemoveDriverContextProvider>
	);
}
