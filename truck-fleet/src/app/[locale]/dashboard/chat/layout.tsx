import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ChatUsers from "./components/ChatUsers";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={"relative flex flex-1 overflow-hidden"}>
			<Card className="relative w-full flex-[0.15] rounded-none border-0 border-border border-l px-3 backdrop-saturate-150 transition-all duration-">
				<CardHeader className="px-0 flex">
					<CardTitle className="flex items-center gap-2">
						<SidebarTrigger />
						Chats
					</CardTitle>
				</CardHeader>

				<ChatUsers />
			</Card>

			<div className="relative w-full flex-1 rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300">
				<div className="relative w-full">{children}</div>{" "}
			</div>
		</div>
	);
}
