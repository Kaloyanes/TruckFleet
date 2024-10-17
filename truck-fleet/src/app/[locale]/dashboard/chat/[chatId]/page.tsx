import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ChatSlug({ params }: { params: { chatId: string } }) {
	return (
		<div className="relative flex flex-col overflow-y-scroll">
			<ScrollArea className="h-screen">
				<ScrollBar />
				{new Array(250).fill(0).map((_, i) => (
					<h1 key={Math.random()}>My Post: {params.chatId}</h1>
				))}
			</ScrollArea>
		</div>
	);
}
