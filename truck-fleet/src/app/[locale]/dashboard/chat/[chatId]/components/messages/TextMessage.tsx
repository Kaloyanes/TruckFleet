import Image from "next/image";
import type { Message } from "@/models/message";
import { useTranslations } from "next-intl";

interface TextMessageProps {
	message: Message;
	userId: string;
	senderProfile: { name: string; photoUrl: string };
}

const TextMessage = ({ message, userId, senderProfile }: TextMessageProps) => {
	const t = useTranslations("ChatPage");

	return (
		<div className={"flex flex-row-reverse items-end justify-end gap-2"}>
			<div className="flex flex-col">
				<div
					className={`relative flex min-h-13 w-fit min-w-64 max-w-[30vw] flex-col items-start whitespace-break-spaces break-words rounded-3xl rounded-bl-md bg-accent px-4 py-3 ${
						message.sender === userId ? " bg-sidebar-border" : "bg-secondary"
					}`}
				>
					<h1 className="font-semibold">{senderProfile.name}</h1>
					<p>{message.content}</p>
					{message.updatedAt && (
						<p className="pt-2 text-gray-400 text-xs">{t("edited")}</p>
					)}
				</div>
			</div>
			<Image
				src={senderProfile.photoUrl}
				width={40 * 2}
				height={40 * 2}
				alt={senderProfile.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</div>
	);
};

export default TextMessage;
