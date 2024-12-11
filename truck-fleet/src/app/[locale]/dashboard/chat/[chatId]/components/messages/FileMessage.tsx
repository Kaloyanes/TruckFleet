"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/Utils";
import type { Message } from "@/types/message";
import { IconDownload, IconFile } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

interface FileMessageProps {
	senderProfile: { name: string; photoUrl: string };
	userId?: string;
	message: Message;
}

export default function FileMessage({
	senderProfile,
	userId,
	message,
}: FileMessageProps) {
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownload = async () => {
		try {
			setIsDownloading(true);
			const response = await fetch(message.content);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = message.fileName || "downloaded-file";
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error("Error downloading file:", error);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div className="flex flex-row-reverse items-end justify-end gap-2">
			<Card
				className={cn(
					"flex items-center gap-3 p-3",
					message.sender === userId ? "bg-sidebar-accent" : "bg-muted",
				)}
			>
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
					<IconFile className="text-primary" />
				</div>

				<div className="flex flex-1 flex-col overflow-hidden">
					<span className="truncate text-sm font-medium">
						{message.fileName || "File"}
					</span>
					{message.fileType && (
						<span className="text-xs text-muted-foreground">
							{message.fileType}
						</span>
					)}
				</div>

				<Button
					variant="ghost"
					size="icon"
					className="shrink-0"
					onClick={handleDownload}
					disabled={isDownloading}
				>
					<IconDownload className="h-4 w-4" />
				</Button>
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
}
