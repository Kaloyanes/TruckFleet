import { Spinner } from "@/components/ui/loading-spinner";
import useProfileDoc from "@/hooks/useProfileDoc";
import type { Message } from "@/models/message";
import Image from "next/image";

export default function ChatMessage({
	message,
	userId,
}: { message: Message; userId: string }) {
	const { profile: senderProfile, loading } = useProfileDoc(message.sender);

	if (loading) return <Spinner />;

	return (
		<div
			className={`flex items-center gap-2 ${message.sender === userId ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`flex min-h-13 w-fit min-w-64 max-w-[30vw] flex-col rounded-full bg-secondary px-4 py-3 ${message.sender === userId ? "items-end bg-primary" : "items-start bg-secondary"}`}
			>
				<p className="">{message.content}</p>
			</div>
			<Image
				src={senderProfile?.photoUrl}
				width={40 * 2}
				height={40 * 2}
				alt={senderProfile?.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</div>
	);
}
