import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatSlug({ params }: { params: { chatId: string } }) {
	return (
		<div className="relative flex flex-col overflow-y-scroll">
			<ScrollArea className="flex-1 h-screen">
				{new Array(250).fill(0).map((_, i) => (
					<h1>My Post: {params.chatId}</h1>
				))}
			</ScrollArea>
		</div>
	);
}
