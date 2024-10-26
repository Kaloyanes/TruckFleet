import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ChatUsers from "./components/ChatUsers";
import { setRequestLocale } from "next-intl/server";

export default function ChatLayout({
	params: { locale },
	children,
}: {
	params: { locale: string };
	children: React.ReactNode;
}) {
	setRequestLocale(locale);

	return (
		<div className={"relative flex flex-1 overflow-hidden"}>
			<Card className="relative w-full flex-[0.2] rounded-none border-0 border-border border-l px-3 backdrop-saturate-150 transition-all duration-300">
				<CardHeader className="flex px-0">
					<CardTitle className="flex items-center gap-2">Chats</CardTitle>
				</CardHeader>

				<ChatUsers />
			</Card>

			<div className="relative w-full flex-1 rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300">
				<div className="relative w-full">{children}</div>{" "}
			</div>
		</div>
	);
}
