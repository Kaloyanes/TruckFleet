import {
	View,
	RefreshControl,
	ActivityIndicator,
	Platform,
	Keyboard,
	type KeyboardEvent,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "~/components/ui/text";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import { useTranslation } from "react-i18next";
import useProfileDoc from "~/hooks/useProfileDoc";
import { FlashList } from "@shopify/flash-list";
import { array } from "zod";
import { Input } from "~/components/ui/input";
import { MotiView } from "moti";
import {
	KeyboardAvoidingView,
	useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, {
	useAnimatedStyle,
	useDerivedValue,
} from "react-native-reanimated";
import { useMessageStore } from "~/stores/message-store";
import { Image } from "~/components/ui/image";
import { format } from "date-fns";
import TextMessage from "./(messages)/TextMessage";
import { getAuth } from "@react-native-firebase/auth";
import VideoMessage from "./(messages)/VideoMessage";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import type { FlashListState } from "@shopify/flash-list/dist/FlashList";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export default function ChatPage() {
	const { t } = useTranslation();
	const { id, personId } = useLocalSearchParams();
	const flashListRef = useRef<FlashList<any>>(null);
	const { height, progress } = useReanimatedKeyboardAnimation();
	const footerStyle = useAnimatedStyle(() => ({
		paddingBottom: height.value,
		flex: 1,
	}));
	const { data: otherUser, isLoading } = useProfileDoc(personId as string);

	const userId = getAuth().currentUser?.uid;

	const { loadMessages, loading, messages } = useMessageStore();

	useEffect(() => {
		if ((id as string).trim() !== "") loadMessages(id as string);
	}, [id, loadMessages]);

	const headerHeight = useHeaderHeight();

	if (loading || isLoading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#fff" />
			</View>
		);
	}

	if (!otherUser) {
		return <Text>{t("user_not_found")}</Text>;
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerBackTitle: t("chat"),
					headerStyle: {
						backgroundColor: "transparent",
					},

					headerTitle(props) {
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
				}}
			/>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<AnimatedSafeAreaView style={footerStyle} edges={["bottom"]}>
					<AnimatedFlashList
						ref={flashListRef}
						contentContainerStyle={{
							paddingBottom: 16,
							paddingTop: 16,
						}}
						keyExtractor={(item) => item.id}
						estimatedItemSize={122}
						data={[...messages]}
						inverted={false}
						keyboardDismissMode="interactive"
						keyboardShouldPersistTaps="handled"
						renderItem={({ item }) => {
							if (!item) return null;
							switch (item.type) {
								case "text":
									return (
										<TextMessage
											key={item.id}
											message={item}
											senderProfile={otherUser}
											userId={userId as string}
										/>
									);
								case "video":
									return (
										<VideoMessage
											key={item.id}
											message={item}
											senderProfile={otherUser}
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
						ItemSeparatorComponent={() => <View className="h-4" />}
						ListHeaderComponent={() => (
							<View style={{ height: headerHeight }} />
						)}
						ListEmptyComponent={() => (
							<View className="flex-1 justify-center items-center px-4">
								<Text>{t("no_messages")}</Text>
							</View>
						)}
						style={footerStyle}
						showsVerticalScrollIndicator={false}
						extraData={[userId, progress]}
						ListFooterComponent={() => <Animated.View className="h-2" />}
						onContentSizeChange={() => {
							if (messages.length > 0 && flashListRef.current) {
								flashListRef.current?.scrollToEnd({ animated: false });
							}
						}}
						automaticallyAdjustKeyboardInsets
						automaticallyAdjustContentInsets
					/>
					<View className="px-2 py-2 bg-background border-t border-primary-foreground">
						<Input placeholder={t("type_message")} className="flex-1" />
					</View>
					{/* <MotiView
						animate={footerStyle}
					/> */}
				</AnimatedSafeAreaView>
			</KeyboardAvoidingView>
		</>
	);
}
