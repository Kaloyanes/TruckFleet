import Image from "next/image";
import type { Message } from "@/models/message";
import { useTranslations } from "next-intl";
import LocationMessage from "./LocationMessage";

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
		<div className={"flex flex-row-reverse items-end justify-end gap-2"}>
			<div className="flex flex-col">
				<div
					className={`relative flex min-h-13 w-fit min-w-64 max-w-[30vw] flex-col items-start whitespace-break-spaces break-words rounded-3xl rounded-bl-md px-4 py-3 ${
						message.sender === userId ? "bg-sidebar-accent" : "bg-muted"
					}`}
				>
					<h1 className="font-semibold">{senderProfile.name}</h1>
					<p>{renderContent(message.content)}</p>
					{message.updatedAt && (
						<p className="pt-2 text-xs opacity-70">{t("edited")}</p>
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
