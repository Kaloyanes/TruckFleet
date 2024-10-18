"use client";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

export default function ChatSlug({ params }: { params: { chatId: string } }) {
	return (
		<div className="relative flex flex-col overflow-y-scroll">
			<ChatWindow chatId={params.chatId} />
			<ChatInput />
		</div>
	);
}
