import { View, Image, RefreshControl, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "~/components/ui/text";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import { useTranslation } from "react-i18next";
import useProfileDoc from "~/hooks/useProfileDoc";
import { LegendList } from "@legendapp/list";
import { array } from "zod";
import { Input } from "~/components/ui/input";
import { MotiView } from "moti";
import {
	KeyboardAvoidingView,
	useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import { useDerivedValue } from "react-native-reanimated";
import { useMessageStore } from "~/stores/message-store";

export default function ChatPage() {
	const { t } = useTranslation();
	const { id, personId } = useLocalSearchParams();

	const { data: otherUser, isLoading } = useProfileDoc(personId as string);

	const { height } = useReanimatedKeyboardAnimation();
	const animate = useDerivedValue(() => ({
		translateY: height.value,
	}));

	const { loadMessages, loading, messages } = useMessageStore();

	useEffect(() => {
		loadMessages(id as string);
	}, [id]);

	if (isLoading) return null;

	if (!otherUser) {
		return <Text>{t("user_not_found")}</Text>;
	}
	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#fff" />
			</View>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerBackTitle: t("chat"),
					headerTitle(props) {
						return (
							<View className="flex-row items-center gap-4">
								<Image
									source={{ uri: otherUser.photoUrl }}
									progressiveRenderingEnabled
									className="w-12 h-12 rounded-full"
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
				behavior="padding"
				keyboardVerticalOffset={-20}
				className="flex-1"
			>
				<LegendList
					className="pr-12"
					automaticallyAdjustsScrollIndicatorInsets
					contentInsetAdjustmentBehavior="automatic"
					scrollIndicatorInsets={{ bottom: 0 }}
					contentContainerClassName=""
					maintainScrollAtEnd
					alignItemsAtEnd
					maintainVisibleContentPosition
					onStartReachedThreshold={0.2}
					recycleItems
					data={messages}
					ListEmptyComponent={() => {
						return (
							<View className="flex-1 justify-center items-center">
								<Text>{t("no_messages")}</Text>
							</View>
						);
					}}
					renderItem={({ item }) => (
						<View className="flex-row items-center gap-4 p-4">
							<Image
								source={{ uri: otherUser.photoUrl }}
								className="w-12 h-12 rounded-full"
							/>
							<View className="flex-col">
								<Text>{item.type}</Text>
								<Text>{item.sender}</Text>
							</View>
						</View>
					)}
					estimatedItemSize={70}
					keyboardDismissMode="interactive"
				/>
				<MotiView className="flex-row items-center pb-safe px-4">
					<Input placeholder={t("type_message")} className="flex-1" />
				</MotiView>
			</KeyboardAvoidingView>
		</>
	);
}
