import { type TextInput, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { BlurView } from "expo-blur";
import { MotiView, useAnimationState } from "moti";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "~/components/ui/button";
import {
	IconDotsVertical,
	IconMicrophone,
	IconPlus,
	IconSend,
} from "@tabler/icons-react-native";
import { Input } from "~/components/ui/input";
import { t } from "i18next";
import {
	Easing,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withTiming,
	type WithTimingConfig,
} from "react-native-reanimated";
import { useChatStore } from "~/stores/chat-store";
import { useMessageStore } from "~/stores/message-store";
import ChatInputMore from "./ChatInputMore";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import VoiceMessageButton from "./VoiceMessageButton";

export default function InputToolbar() {
	const { isDarkColorScheme } = useColorScheme();
	const { currentMessage, setMessage, sendMessage, isTyped, isRecording } =
		useMessageStore();
	const [inputHeight, setInputHeight] = useState(48); // Default height for single line
	const [isMultiline, setIsMultiline] = useState(false);
	const inputRef = useRef<TextInput>(null);

	// Get access to the underlying TextInput
	const getTextInputProps = (props: Record<string, any>) => {
		return {
			...props,
			style: {
				...(props.style || {}),
				height: inputHeight,
				maxHeight: 112, // max-h-28 equivalent
				minHeight: 48,
			},
			onContentSizeChange: (event: any) => {
				const { height } = event.nativeEvent.contentSize;
				// Limit max height to match max-h-28 class
				const newHeight = Math.min(height + 16, 112); // Add padding and limit
				setInputHeight(Math.max(48, newHeight)); // Ensure minimum height
				setIsMultiline(height > 48);

				// Call original handler if exists
				props.onContentSizeChange?.(event);
			},
		};
	};

	return (
		<KeyboardStickyView
			offset={{
				opened: 20,
			}}
			className="absolute bottom-0 w-full min-h-28"
		>
			<BlurView
				intensity={80}
				tint="prominent"
				className="px-2 py-2 android:bg-background pb-safe flex-row items-center w-full min-h-28"
			>
				<ChatInputMore isDarkColorScheme={isDarkColorScheme} />

				<View className="flex-1 h-auto">
					<Input
						ref={inputRef}
						placeholder={
							isRecording ? "Recording audio..." : t("chats.type_message")
						}
						className="!w-full !h-14 !max-h-28 focus:ring-1 focus:ring-primary focus:ring-opacity-50"
						value={currentMessage}
						onChangeText={(text) => {
							setMessage(text);
						}}
						returnKeyType="send"
						enablesReturnKeyAutomatically
						onSubmitEditing={sendMessage}
						multiline
						numberOfLines={1}
						trailingIcon={
							<VoiceMessageButton
								isTyped={isTyped}
								isDarkColorScheme={isDarkColorScheme}
							/>
						}
						readOnly={isRecording}
					/>
				</View>

				<MotiView
					animate={useDerivedValue(() => ({
						width: isTyped ? 48 : 0,
						translateX: isTyped ? 0 : 20,
						marginHorizontal: isTyped ? 10 : 0,
					}))}
					transition={{
						type: "timing",
						duration: 500,
						easing: Easing.out(Easing.poly(5)),
					}}
				>
					<Button
						size="icon"
						onPress={sendMessage}
						className="h-12 aspect-square "
					>
						<IconSend size={24} color="#000" />
					</Button>
				</MotiView>
			</BlurView>
		</KeyboardStickyView>
	);
}
