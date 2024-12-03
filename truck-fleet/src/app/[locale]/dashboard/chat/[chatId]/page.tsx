"use client";;
import { use } from "react";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

export default function ChatSlug(props: { params: Promise<{ chatId: string }> }) {
    const params = use(props.params);

    const {
        chatId
    } = params;

    return (
		<div className="relative flex flex-1 flex-col overflow-hidden">
			<ChatWindow />
			<ChatInput />
		</div>
	);
}
