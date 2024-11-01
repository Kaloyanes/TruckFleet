import Image from "next/image";
import type { Message } from "@/models/message";
import { useTranslations } from "next-intl";
import { CustomAudioPlayer } from "../CustomAudioPlayer";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AudioMessageProps {
	message: Message;
	userId: string;
	senderProfile: { name: string; photoUrl: string };
}

const AudioMessage = ({
	message,
	userId,
	senderProfile,
}: AudioMessageProps) => {
	const t = useTranslations("ChatPage");

	return (
		<div className="flex flex-row-reverse items-end justify-end gap-2">
			<Card
				className={cn(
					"p-3",
					message.sender === userId ? "bg-sidebar-accent" : "bg-muted",
				)}
			>
				<div className="flex flex-col gap-2">
					<h1 className="font-semibold">{senderProfile.name}</h1>
					<CustomAudioPlayer src={message.content} />
					{message.updatedAt && (
						<p className="text-xs text-muted-foreground">{t("edited")}</p>
					)}
				</div>
			</Card>
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

export default AudioMessage;
