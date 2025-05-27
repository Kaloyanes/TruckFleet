import {
	type TextInput,
	View,
	type NativeSyntheticEvent,
	type TextInputContentSizeChangeEventData,
	Platform,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
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
import { MarkdownInput } from "~/components/ui/markdown-input";
import type { MarkdownTextInput } from "@expensify/react-native-live-markdown";

type ContentSizeChangeEvent =
	NativeSyntheticEvent<TextInputContentSizeChangeEventData>;

export default function InputToolbar() {
	const { isDarkColorScheme } = useColorScheme();
	const {
		currentMessage,
		setMessage,
		sendMessage,
		isTyped,
		isRecording,
		inputHeight,
		setInputHeight,
	} = useMessageStore();

	const [isMultiline, setIsMultiline] = useState(false);
	const inputRef = useRef<MarkdownTextInput>(null);
	const contentSizeRef = useRef<{ width: number; height: number }>({
		width: 0,
		height: 0,
	});

	// Calculate and update input height based on text content
	const updateInputHeight = useCallback(
		(text: string) => {
			// Estimate by counting lines and characters
			const lines = text.split("\n");
			const lineCount = lines.length;

			// Find the longest line length to account for text wrapping
			const longestLineLength = Math.max(
				...lines.map((line) => line.length),
				0,
			);

			// Estimate additional wrapped lines based on character count
			// Assuming approximately 35-40 chars per line on average mobile device
			const charsPerLine = 38;
			const estimatedWrappedLines = lines.reduce((acc, line) => {
				return acc + Math.max(0, Math.ceil(line.length / charsPerLine) - 1);
			}, 0);

			const totalLineEstimate = lineCount + estimatedWrappedLines;

			// Calculate height with padding
			let newHeight = 48; // Base height for a single line

			if (text.length > 0) {
				// Each line is approximately 20px tall
				newHeight = Math.min(48 + (totalLineEstimate - 1) * 20, 112);
			}

			// Utilize any content size information we might have
			if (contentSizeRef.current.height > 0) {
				// Blend our estimate with the actual content size measurement
				const measuredHeight = contentSizeRef.current.height + 16; // Add padding
				newHeight = Math.min(Math.max(measuredHeight, newHeight), 112);
			}

			setInputHeight(newHeight);
			setIsMultiline(totalLineEstimate > 1);
		},
		[setInputHeight],
	);

	// Handle text changes
	const handleTextChange = useCallback(
		(text: string) => {
			setMessage(text);
			updateInputHeight(text);
		},
		[setMessage, updateInputHeight],
	);

	// Handle content size change event
	const handleContentSizeChange = useCallback(
		(event: ContentSizeChangeEvent) => {
			const { width, height } = event.nativeEvent.contentSize;

			// Store the content size for future reference
			contentSizeRef.current = { width, height };

			// Calculate new height with padding
			const padding = 16; // Total vertical padding
			const newHeight = Math.min(Math.max(height + padding, 48), 112);

			setInputHeight(newHeight);
			setIsMultiline(height > 32);
		},
		[setInputHeight],
	);

	function parser(input: string) {
		"worklet";

		const ranges: Array<{ start: number; length: number; type: string }> = [];
		const regexp = /\*(.*?)\*/g;
		let match: RegExpExecArray | null;

		// Fixing linter error by using a different approach
		let result = regexp.exec(input);
		while (result !== null) {
			if (result[1]) {
				ranges.push({ start: result.index, length: 1, type: "syntax" });
				ranges.push({
					start: result.index + 1,
					length: result[1].length,
					type: "bold",
				});
				ranges.push({
					start: result.index + 1 + result[1].length,
					length: 1,
					type: "syntax",
				});
			}
			result = regexp.exec(input);
		}
		return ranges;
	}

	const animatedProps = {
		width: isTyped ? 48 : 0,
		translateX: isTyped ? 0 : 20,
		marginHorizontal: isTyped ? 10 : 0,
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
							isRecording ? t("recording_audio") : t("chats.type_message")
						}
						className="!w-full focus:ring-1 focus:ring-primary focus:ring-opacity-50"
						value={currentMessage}
						onChangeText={handleTextChange}
						returnKeyType="send"
						enablesReturnKeyAutomatically
						onSubmitEditing={sendMessage}
						multiline
						scrollEnabled={true}
						numberOfLines={Math.min(Math.ceil(inputHeight / 24), 5)}
						placeholderClassName="h-full w-full flex items-center justify-center"
						style={{
							height: inputHeight,
							maxHeight: 112, // max-h-28 equivalent
							minHeight: 48,
							paddingTop: 8,
							paddingBottom: 8,
							textAlignVertical: "center",
						}}
						textAlignVertical="center"
						onContentSizeChange={handleContentSizeChange}
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
					from={{
						width: 0,
						translateX: 20,
						marginHorizontal: 0,
					}}
					animate={{
						width: isTyped ? 48 : 0,
						translateX: isTyped ? 0 : 20,
						marginHorizontal: isTyped ? 10 : 0,
					}}
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
