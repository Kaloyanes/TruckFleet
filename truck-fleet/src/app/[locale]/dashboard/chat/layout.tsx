import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ChatUsers from "./components/ChatUsers";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={"relative flex flex-1 overflow-hidden"}>
			<Card className="relative w-full flex-[0.15] rounded-none border-0 border-border border-l px-3 backdrop-saturate-150 transition-all duration-300">
				<CardHeader className="px-0">
					<CardTitle>Chats</CardTitle>
				</CardHeader>

				<ChatUsers />
			</Card>

			<Card className="relative w-full flex-1 rounded-none border-0 border-border border-l backdrop-saturate-150 transition-all duration-300">
				<div className="relative w-full">{children}</div>x{" "}
			</Card>
		</div>
	);
}
