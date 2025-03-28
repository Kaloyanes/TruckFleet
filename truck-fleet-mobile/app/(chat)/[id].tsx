import { View, ActivityIndicator, RefreshControl } from "react-native";
import React, { useEffect, useRef, useMemo } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Text } from "~/components/ui/text";
import { useTranslation } from "react-i18next";
import useProfileDoc from "~/hooks/useProfileDoc";
import { FlashList } from "@shopify/flash-list";
import {
	KeyboardAvoidingView,
	KeyboardStickyView,
	useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, {
	Easing,
	useAnimatedStyle,
	interpolate,
	useDerivedValue,
	withTiming,
	withSpring,
} from "react-native-reanimated";
import { type Message, useMessageStore } from "~/stores/message-store";
import { Image } from "~/components/ui/image";

import { getAuth } from "@react-native-firebase/auth";

import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InputToolbar from "./components/InputToolbar";
import TextMessage from "./components/(messages)/TextMessage";
import VideoMessage from "./components/(messages)/VideoMessage";
import { MotiView } from "moti";
import { firebase } from "@react-native-firebase/firestore";
import ImageMessage from "./components/(messages)/ImageMessage";
import FileMessage from "./components/(messages)/FileMessage";
import AudioMessage from "./components/(messages)/AudioMessage";
import LocationMessage from "./components/(messages)/LocationMessage";
import { BlurView } from "expo-blur";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function ChatPage() {
	const { t } = useTranslation();
	const { id, personId } = useLocalSearchParams();
	const headerHeight = useHeaderHeight();
	const { height, progress } = useReanimatedKeyboardAnimation();
	const insets = useSafeAreaInsets();

	const { data: otherUser, isLoading } = useProfileDoc(personId as string);

	const { data: user, isLoading: userProfileLoading } = useProfileDoc(
		firebase.auth().currentUser?.uid as string,
	);

	const flashListRef = useRef<FlashList<Message>>(null);
	const userId = getAuth().currentUser?.uid;

	const {
		loadMessages,
		loading,
		messages,
		loadMoreMessages,
		isRefreshing,
		setRef,
		statusOfMessage,
		setStatusOfMessage,
		inputHeight,
	} = useMessageStore();

	// Calculate dynamic header height based on input height
	const listHeaderHeight = useDerivedValue(() => {
		// Base height (36) + additional height based on input expansion
		const additionalHeight = inputHeight - 48; // 48 is the default input height
		const calculatedHeight = 36 + Math.max(0, additionalHeight) + insets.bottom;

		// Use withTiming for smooth transitions
		return withTiming(calculatedHeight, {
			duration: 150,
			easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		});
	}, [inputHeight, insets.bottom]);

	// Create animated style for header component
	const headerStyle = useAnimatedStyle(() => ({
		height: listHeaderHeight.value + 25,
		width: "auto",
	}));

	useEffect(() => {
		if (flashListRef.current) setRef(flashListRef);
	}, [setRef]);

	useEffect(() => {
		if (id) {
			loadMessages(id as string);
		}
	}, [id, loadMessages]);

	const navigation = useNavigation();

	useEffect(() => {
		if (otherUser)
			navigation.setOptions({
				headerBackTitle: t("chat"),
				headerStyle: {
					backgroundColor: "transparent",
				},

				headerTitle() {
					return (
						<View className="w-full flex-row items-center justify-start gap-4 ">
							<AnimatedImage
								sharedTransitionTag={otherUser.photoUrl}
								source={otherUser.photoUrl}
								className="h-10 w-10 rounded-full"
							/>
							<Text className="font-bold text-xl">{otherUser.name}</Text>
						</View>
					);
				},
				headerLargeTitle: false,
				headerBackButtonDisplayMode: "minimal",
			});
	}, [otherUser, navigation.setOptions, t]);

	useEffect(() => {
		navigation.setOptions({
			headerBackground: () => (
				<View className="relative h-full w-full">
					<BlurView
						className="h-full w-full android:bg-background pb-4"
						intensity={80}
						tint="prominent"
					/>
					<MotiView
						className={"absolute right-0 bottom-0 left-0 z-10 h-0.5 bg-white"}
						animate={{
							width: `${statusOfMessage}%`,
						}}
						transition={{
							type: "timing",
							easing: Easing.inOut(Easing.poly(4)),
							duration: 600,
						}}
					/>
				</View>
			),
		});
	}, [navigation.setOptions, statusOfMessage]);

	const style = useAnimatedStyle(() => ({
		paddingBottom: height.value === 0 ? 0 : Math.abs(height.value + 20),
		width: "100%",
		height: "100%",
	}));

	if (loading || isLoading || userProfileLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#fff" />
			</View>
		);
	}

	if (!otherUser || !user) {
		return <Text>{t("user_not_found")}</Text>;
	}

	return (
		<MotiView
			style={style}
			transition={{
				type: "no-animation",
			}}
		>
			<FlashList
				ref={flashListRef}
				contentContainerStyle={{
					paddingTop: 16,
					paddingBottom: headerHeight + 16,
					paddingHorizontal: 16,
				}}
				scrollIndicatorInsets={{
					top: -headerHeight + 100,
					bottom: headerHeight - 32,
				}}
				keyExtractor={(item) => item.id}
				inverted
				estimatedItemSize={134}
				data={[...messages].reverse()}
				keyboardDismissMode="interactive"
				onEndReached={() => loadMoreMessages(id as string)}
				refreshing={isRefreshing}
				fadingEdgeLength={50}
				renderItem={({ item, index }) => {
					if (!item || !item.content) {
						console.log(`Empty message at index ${index}:`, item);
						return null;
					}

					const sendUser = item.sender === userId ? user : otherUser;
					switch (item.type) {
						case "text":
							return (
								<TextMessage
									key={item.id}
									message={item}
									senderProfile={sendUser}
									userId={userId as string}
								/>
							);
						case "video":
							return (
								<VideoMessage
									key={item.id}
									message={item}
									senderProfile={sendUser}
									userId={userId as string}
								/>
							);
						case "image":
							return (
								<ImageMessage
									key={item.id}
									message={item}
									senderProfile={sendUser}
									userId={userId as string}
								/>
							);
						case "file":
							return (
								<FileMessage
									key={item.id}
									message={item}
									senderProfile={sendUser}
									userId={userId as string}
								/>
							);
						case "audio":
							return (
								<AudioMessage
									key={item.id}
									message={item}
									senderProfile={sendUser}
									userId={userId as string}
								/>
							);
						case "location":
							return (
								<LocationMessage
									key={item.id}
									message={item}
									senderProfile={sendUser}
									userId={userId as string}
								/>
							);
						default:
							return (
								<View>
									<Text>{item.type}</Text>
								</View>
							);
					}
				}}
				ListHeaderComponent={
					<MotiView
						style={headerStyle}
						transition={{
							type: "timing",
							duration: 400,
							easing: Easing.inOut(Easing.poly(4)),
						}}
					/>
				}
				ItemSeparatorComponent={() => <View className="h-4" />}
				getItemType={(item) => item.type}
			/>

			<InputToolbar />
		</MotiView>
	);
}
