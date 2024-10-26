"use client";
import { use } from "react";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import { setRequestLocale } from "next-intl/server";

export default function ChatSlug({
	params: { chatId },
}: { params: { chatId: string } }) {
	return (
		<div className="relative flex flex-col overflow-y-scroll">
			<ChatWindow />
			<ChatInput />
		</div>
	);
}
