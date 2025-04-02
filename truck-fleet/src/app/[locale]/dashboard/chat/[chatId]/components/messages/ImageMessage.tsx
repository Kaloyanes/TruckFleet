import Image from "next/image";
import type { Message } from "@/types/message";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { IconX } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImageMessageProps {
	message: Message;
	senderProfile: { name: string; photoUrl: string };
	userId: string;
}

const ImageMessage = ({
	message,
	senderProfile,
	userId,
}: ImageMessageProps) => {
	return (
		<Dialog>
			<div className={"flex flex-row-reverse items-end justify-end gap-2"}>
				<Card
					className={cn(
						"p-0",
						message.sender === userId ? "bg-sidebar-accent" : "bg-muted",
					)}
				>
					<DialogTrigger asChild>
						<Image
							priority
							src={message.content}
							alt={message.sender}
							className="max-w-xs rounded-lg shadow-sm"
							width={320}
							height={320}
						/>
					</DialogTrigger>
				</Card>
				<Image
					src={senderProfile.photoUrl}
					width={40 * 2}
					height={40 * 2}
					alt={senderProfile.name}
					className="h-12 w-12 rounded-full object-cover"
				/>
			</div>

			<DialogContent className="justify-center p-0">
				<Image
					src={message.content}
					alt={message.sender}
					className=" rounded-lg shadow-sm"
					width={600}
					height={500}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default ImageMessage;
