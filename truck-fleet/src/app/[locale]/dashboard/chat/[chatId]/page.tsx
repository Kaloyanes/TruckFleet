"use client";;
import { use } from "react";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

export default function ChatSlug(props: { params: Promise<{ chatId: string }> }) {
    const params = use(props.params);
    return (
		<div className="relative flex flex-col overflow-y-scroll">
			<ChatWindow />
			<ChatInput />
		</div>
	);
}
