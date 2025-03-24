import { Alert, View } from "react-native";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { IconMicrophone } from "@tabler/icons-react-native";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { useMessageStore } from "~/stores/message-store";
import {
	Easing,
	useDerivedValue,
	useSharedValue,
} from "react-native-reanimated";
import { MotiView, useAnimationState } from "moti";

export default function VoiceMessageButton({
	isTyped,
	isDarkColorScheme,
}: {
	isTyped: boolean;
	isDarkColorScheme: boolean;
}) {
	const { sendAudio, isRecording, setIsRecording } = useMessageStore();
	const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
	const variants = useAnimationState({
		from: {
			opacity: 0,
			scale: 0,
		},

		recording: {
			opacity: [0.7, 1],
			scale: [0.5, 1],
		},
	});

	const record = async () => {
		await requestPermissions();

		if (!(await AudioModule.getRecordingPermissionsAsync()).granted) {
			Alert.alert("Permission to access microphone was denied");
			return;
		}

		await audioRecorder.prepareToRecordAsync();
		audioRecorder.record();

		variants.transitionTo("recording");
		setIsRecording(true);

		console.log("Recording started");
	};

	const stopRecording = async () => {
		// The recording will be available on `audioRecorder.uri`.
		await audioRecorder.stop();

		variants.transitionTo("from");
		setIsRecording(false);

		// Uncomment this when you're ready to send audio
		if (audioRecorder.uri) sendAudio(audioRecorder.uri);
	};

	const requestPermissions = async () => {
		const status = await AudioModule.requestRecordingPermissionsAsync();
		if (!status.granted) {
			Alert.alert("Permission to access microphone was denied");
		}
	};

	return (
		<MotiView
			from={{
				opacity: 0,
				scale: 0.5,
			}}
			animate={useDerivedValue(() => ({
				opacity: !isTyped ? 1 : 0,
				scale: !isTyped ? 1 : 0.5,
				backgroundColor: isRecording ? "#FF162B" : "#ffffff00",
			}))}
			transition={{
				type: "timing",
				duration: 500,
				easing: Easing.out(Easing.poly(5)),
			}}
			className="relative w-full rounded-2xl"
		>
			<MotiView
				state={variants}
				transition={{
					type: "timing",
					duration: 700,
					easing: Easing.inOut(Easing.poly(3)),
					loop: true,
				}}
				className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full z-20"
			/>
			<Button
				variant={"ghost"}
				size="icon"
				onPress={() => {
					if (audioRecorder.isRecording) {
						stopRecording();
					} else {
						record();
					}
				}}
				className="h-12 aspect-square"
				disabled={isTyped}
			>
				<IconMicrophone
					size={24}
					color={isRecording || isDarkColorScheme ? "#fff" : "#000"}
				/>
			</Button>
		</MotiView>
	);
}
