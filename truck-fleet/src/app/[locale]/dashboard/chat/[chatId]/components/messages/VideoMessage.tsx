import { cn } from "@/lib/Utils";
import type { Message } from "@/types/message";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
	IconPlayerPause,
	IconPlayerPlay,
	IconVolume,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface VideoMessageProps {
	message: Message;
	userId?: string;
	senderProfile: any;
}

export default function VideoMessage({
	message,
	userId,
	senderProfile,
}: VideoMessageProps) {
	const isSender = message.sender === userId;
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		// Set initial volume
		video.volume = volume;

		const handleTimeUpdate = () => {
			setProgress((video.currentTime / video.duration) * 100);
		};

		const handleLoadedMetadata = () => {
			setDuration(video.duration);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setProgress(0);
			video.currentTime = 0;
		};

		video.addEventListener("timeupdate", handleTimeUpdate);
		video.addEventListener("loadedmetadata", handleLoadedMetadata);
		video.addEventListener("ended", handleEnded);

		return () => {
			video.removeEventListener("timeupdate", handleTimeUpdate);
			video.removeEventListener("loadedmetadata", handleLoadedMetadata);
			video.removeEventListener("ended", handleEnded);
		};
	}, [volume]);

	const togglePlay = () => {
		if (!videoRef.current) return;

		if (isPlaying) {
			videoRef.current.pause();
		} else {
			videoRef.current.play();
		}
		setIsPlaying(!isPlaying);
	};

	const handleProgressChange = (value: number[]) => {
		if (!videoRef.current) return;
		const newTime = (value[0] / 100) * duration;
		videoRef.current.currentTime = newTime;
		setProgress(value[0]);
	};

	const handleVolumeChange = (value: number[]) => {
		if (!videoRef.current) return;
		const newVolume = value[0];
		videoRef.current.volume = newVolume;
		setVolume(newVolume);
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="flex flex-row-reverse items-end justify-end gap-2">
			<Card
				className={cn(
					"p-0",
					message.sender === userId ? "bg-sidebar-accent" : "bg-muted",
				)}
			>
				<div className="relative w-full overflow-hidden rounded-lg max-w-sm">
					<video
						ref={videoRef}
						className="h-full w-full cursor-pointer object-contain"
						src={message.content}
						playsInline
						onClick={togglePlay}
						onKeyUp={togglePlay}
						preload="metadata"
					>
						<track kind="captions" />
					</video>
					<div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 backdrop-blur-sm">
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-white hover:text-white"
								onClick={togglePlay}
							>
								{isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
							</Button>
							<div className="flex flex-1 items-center gap-2">
								<span className="text-xs text-white">
									{formatTime(videoRef.current?.currentTime || 0)}
								</span>
								<Slider
									value={[progress]}
									onValueChange={handleProgressChange}
									max={100}
									step={0.1}
									className="flex-1"
								/>
								<span className="text-xs text-white">
									{formatTime(duration)}
								</span>
								<div className="flex items-center gap-2 ml-2">
									<IconVolume size={16} className="text-white" />
									<Slider
										value={[volume]}
										onValueChange={handleVolumeChange}
										max={1}
										step={0.01}
										className="w-20"
									/>
								</div>
							</div>
						</div>
					</div>
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
}
