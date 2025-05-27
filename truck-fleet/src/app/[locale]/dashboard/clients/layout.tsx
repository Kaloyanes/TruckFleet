import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import LetterPullup from "@/components/ui/letter-pullup";
import { IconPlus } from "@tabler/icons-react";
import AddCustomerSheet from "./components/AddClientSheet";
import { useTranslations } from "next-intl";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = useTranslations();

	return (
		<Card className="relative w-full flex-1 rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300">
			<CardHeader className="sticky top-0 mb-0 flex flex-row items-center justify-between border-b bg-sidebar">
				<LetterPullup words={t("SidebarLink.clients")} delay={0.1} />
				<AddCustomerSheet />
			</CardHeader>
			<div className="relative w-full">{children}</div>
		</Card>
	);
}
