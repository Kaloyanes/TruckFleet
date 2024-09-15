import InviteCodeInfo from "@/components/drivers/InviteCode";
import RemoveDriverConfirmationDialog from "@/components/drivers/RemoveDriverConfirmationDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DriverToggleViewContextProvider from "@/context/drivers/driver-toggle-view-context";
import RemoveDriverContextProvider from "@/context/drivers/remove-driver-context";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

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
				<div className={"relative  flex overflow-hidden flex-1"}>
					<Card className="w-full border-0 border-l rounded-none border-border   flex-1    transition-all  duration-300 relative backdrop-saturate-150">
						<CardHeader className="border-b flex flex-row justify-between items-center sticky top-0">
							<div className="flex flex-col gap-4">
								<h1 className="text-2xl font-bold">{t("drivers")}</h1>
								<Input placeholder={t2("filterDrivers")} />
							</div>
							<InviteCodeInfo />
						</CardHeader>
						{/* <CardContent className="p-0 relative overflow-hidden flex-1"> */}

						<div className="w-full relative">{children}</div>
						{/* </CardContent> */}
					</Card>
				</div>
			</DriverToggleViewContextProvider>
		</RemoveDriverContextProvider>
	);
}
