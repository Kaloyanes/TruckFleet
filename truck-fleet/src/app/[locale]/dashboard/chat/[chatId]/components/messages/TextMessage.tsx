import Image from "next/image";
import type { Message } from "@/types/message";
import { useTranslations } from "next-intl";
import LocationMessage from "./LocationMessage";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TextMessageProps {
	message: Message;
	userId: string;
	senderProfile: { name: string; photoUrl: string };
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const GOOGLEMAP_REGEX =
	/https:\/\/www\.google\.com\/maps\/@(-?\d+\.\d+),(-?\d+\.\d+)/;

const TextMessage = ({ message, userId, senderProfile }: TextMessageProps) => {
	const t = useTranslations("ChatPage");

	const renderContent = (content: string) => {
		const parts = content.split(URL_REGEX);
		const urls = content.match(URL_REGEX) || [];
		const urlIndex = 0;

		return parts.map((part, index) => {
			if (index % 2 === 1) {
				// URL part
				const mapMatch = urls[urlIndex]?.match(GOOGLEMAP_REGEX);
				if (mapMatch) {
					const [_, lat, lng] = mapMatch;
					const locationMessage = {
						...message,
						content: JSON.stringify({
							lat: Number.parseFloat(lat),
							lng: Number.parseFloat(lng),
						}),
					};
					return (
						<LocationMessage
							key={locationMessage.content}
							message={locationMessage}
							userId={userId}
							senderProfile={senderProfile}
							showMessageStyling={false}
						/>
					);
				}

				// Handle regular URLs
				return (
					<a
						key={urls[urlIndex]}
						href={urls[urlIndex]}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:underline"
					>
						{urls[urlIndex]}
					</a>
				);
			}

			return <span key={part}>{part}</span>;
		});
	};

	return (
		<div className="flex flex-row-reverse items-end justify-end gap-2">
			<Card
				className={cn(
					"p-3 max-w-lg",
					message.sender === userId ? "bg-sidebar-accent" : "bg-muted",
				)}
			>
				<div className="flex flex-col gap-1">
					<h1 className="font-semibold">{senderProfile.name}</h1>
					<p>{renderContent(message.content)}</p>
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

export default TextMessage;
