import { View, ActivityIndicator, RefreshControl } from "react-native";
import React, { useEffect, useRef } from "react";
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
import Animated, { Easing, useAnimatedStyle } from "react-native-reanimated";
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
import { BlurView } from "expo-blur";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function ChatPage() {
	const { t } = useTranslation();
	const { id, personId } = useLocalSearchParams();
	const headerHeight = useHeaderHeight();
	const { height, progress } = useReanimatedKeyboardAnimation();

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
	} = useMessageStore();

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
						<View className="flex-row items-center justify-start gap-4 w-full ">
							<AnimatedImage
								sharedTransitionTag={otherUser.photoUrl}
								source={otherUser.photoUrl}
								className="w-10 h-10 rounded-full"
							/>
							<Text className="text-xl font-bold">{otherUser.name}</Text>
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
				<View className="w-full h-full relative ">
					<BlurView
						className="w-full h-full pb-4 android:bg-background"
						intensity={80}
						tint="prominent"
					/>
					<MotiView
						className={"absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-white"}
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
			<View className="flex-1 justify-center items-center">
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
						default:
							return (
								<View>
									<Text>{item.type}</Text>
								</View>
							);
					}
				}}
				ListHeaderComponent={<View className="h-36 pb-safe" />}
				ItemSeparatorComponent={() => <View className="h-4" />}
				getItemType={(item) => item.type}
			/>

			<InputToolbar />
		</MotiView>
	);
}
