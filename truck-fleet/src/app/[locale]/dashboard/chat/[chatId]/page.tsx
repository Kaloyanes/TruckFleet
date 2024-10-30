"use client";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

export default function ChatSlug({
	params: { chatId },
}: { params: { chatId: string } }) {
	return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<ChatWindow />
			<ChatInput />
		</div>
	);
}
