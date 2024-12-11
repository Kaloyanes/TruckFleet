import { use } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import LetterPullup from "@/components/ui/letter-pullup";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import ChatUsers from "./components/ChatUsers";

export default function ChatLayout(props: {
	params: Promise<{ locale: string }>;
	children: React.ReactNode;
}) {
	const params = use(props.params);

	const { locale } = params;

	const { children } = props;

	setRequestLocale(locale);

	const t = useTranslations();

	return (
		<div className="relative flex max-h-screen flex-1 overflow-hidden">
			<Card className="!bg-sidebar relative max-h-screen w-full flex-[0.2] flex-shrink-0 rounded-none border-0 border-border border-l  backdrop-saturate-150 transition-all duration-300">
				<CardHeader className="flex px-0">
					<CardTitle className="flex items-center gap-2 pl-4">
						<LetterPullup words={t("SidebarLink.chat")} delay={0.1} />
					</CardTitle>
				</CardHeader>

				<ChatUsers />
			</Card>

			<div className="relative flex w-full flex-1 flex-col rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300">
				<div className="relative w-full flex-1">{children}</div>{" "}
			</div>
		</div>
	);
}
