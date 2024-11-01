"use client";
import { Slider } from "@/components/ui/slider";
import {
	IconPlayerPause,
	IconPlayerPlay,
	IconVolume,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

interface CustomAudioPlayerProps {
	src: string;
}

const formatTime = (timeInSeconds: number): string => {
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = Math.floor(timeInSeconds % 60);
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function CustomAudioPlayer({ src }: CustomAudioPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [volume, setVolume] = useState(1);
	const audioRef = useRef<HTMLAudioElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (typeof window === "undefined") return; // Only run on client side

		const audio = audioRef.current;
		if (!audio) return;

		// Reset states when src changes
		setIsLoading(true);
		setDuration(0);
		setCurrentTime(0);
		setIsPlaying(false);

		const checkAndSetDuration = () => {
			const audioDuration = audio.duration;
			console.log(audioDuration);
			setIsLoading(false);
			if (!Number.isNaN(audioDuration) && Number.isFinite(audioDuration)) {
				setDuration(audioDuration);
			}
		};

		const handleLoadedMetadata = () => {
			console.log("loadedmetadata event fired");
			checkAndSetDuration();
		};

		const handleLoadedData = () => {
			console.log("loadeddata event fired");
			checkAndSetDuration();
		};

		const handleDurationChange = () => {
			console.log("durationchange event fired");
			checkAndSetDuration();
		};

		const handleCanPlay = () => {
			console.log("canplay event fired");
			checkAndSetDuration();
		};

		const handleTimeUpdate = () => {
			const audioTime = audio.currentTime;
			if (!Number.isNaN(audioTime) && Number.isFinite(audioTime)) {
				setCurrentTime(audioTime);
				checkAndSetDuration();
			}
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
		};

		// Only attach events on client side
		if (typeof window !== "undefined") {
			audio.addEventListener("loadedmetadata", handleLoadedMetadata);
			audio.addEventListener("loadeddata", handleLoadedData);
			audio.addEventListener("durationchange", handleDurationChange);
			audio.addEventListener("canplay", handleCanPlay);
			audio.addEventListener("timeupdate", handleTimeUpdate);
			audio.addEventListener("ended", handleEnded);

			audio.load();
		}

		return () => {
			if (typeof window !== "undefined") {
				audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
				audio.removeEventListener("loadeddata", handleLoadedData);
				audio.removeEventListener("durationchange", handleDurationChange);
				audio.removeEventListener("canplay", handleCanPlay);
				audio.removeEventListener("timeupdate", handleTimeUpdate);
				audio.removeEventListener("ended", handleEnded);
			}
		};
	}, [src]);

	const togglePlayPause = () => {
		if (audioRef.current?.paused) {
			audioRef.current?.play();
			setIsPlaying(true);
		} else {
			audioRef.current?.pause();
			setIsPlaying(false);
		}
	};

	const handleProgressChange = (value: number[]) => {
		const audio = audioRef.current;
		if (!audio || !duration || Number.isNaN(duration)) return;

		const newTime = (value[0] / 100) * duration;
		if (Number.isFinite(newTime) && newTime >= 0 && newTime <= duration) {
			audio.currentTime = newTime;
		}
	};

	const handleVolumeChange = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.volume = value[0];
			setVolume(value[0]);
		}
	};

	return (
		<div className="flex h-full w-full items-center gap-2 pt-4">
			<audio ref={audioRef} src={src} preload="metadata">
				<track kind="captions" src="" label="Captions" />
			</audio>
			<button
				type="button"
				onClick={togglePlayPause}
				className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
			>
				{isPlaying ? (
					<IconPlayerPause size={18} />
				) : (
					<IconPlayerPlay size={18} />
				)}
			</button>

			<div className="flex flex-1 flex-col gap-2">
				<Slider
					value={[isLoading ? 0 : (currentTime / duration) * 100]}
					min={0}
					max={100}
					step={0.1}
					onValueChange={handleProgressChange}
					className="cursor-pointer"
				/>
				<div className="flex items-center justify-between">
					<div className="text-muted-foreground text-xs">
						<span>{formatTime(currentTime)}</span>
						{" / "}
						<span>{isLoading ? "0:00" : formatTime(duration)}</span>
					</div>
					<div className="flex items-center gap-2">
						<IconVolume size={16} className="text-muted-foreground" />
						<Slider
							min={0}
							max={1}
							step={0.01}
							value={[volume]}
							onValueChange={handleVolumeChange}
							className="h-1 w-20 rounded-full bg-secondary"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
