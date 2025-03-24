import { ActivityIndicator, RefreshControl, View } from "react-native";
import React, { useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { Text } from "~/components/ui/text";

import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Stack, useRouter } from "expo-router";
import { LegendList } from "@legendapp/list";
import { useChatStore } from "~/stores/chat-store";
import ChatLink from "~/components/chats/ChatLink";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import FabButton from "~/components/FabButton";
import {
	IconBox,
	IconMoodEmpty,
	IconPlus,
	IconSearchOff,
	IconZoomCancel,
} from "@tabler/icons-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import useProfileDoc from "~/hooks/useProfileDoc";
import { getAuth } from "@react-native-firebase/auth";
import { useProfileStore } from "~/stores/profile-store";
import { useTranslation } from "react-i18next";
export default function List() {
	const headerHeight = useHeaderHeight();
	const tabHeight = useBottomTabBarHeight();
	const router = useRouter();
	const { isLoading, chatHistory, loadPeople, searchTerm } = useChatStore();

	const { user } = useProfileStore();
	const { data: userProfile } = useProfileDoc(user.uid);
	const { t } = useTranslation();
	const { isDarkColorScheme } = useColorScheme();

	useEffect(() => {
		// Load chat history when component mounts
		useChatStore.getState().loadChatHistory();

		if (userProfile?.companyId) {
			loadPeople(userProfile.companyId);
		}

		// Cleanup when component unmounts
		return () => {
			useChatStore.getState().cleanupChatHistory();
		};
	}, [userProfile?.companyId, loadPeople]);

	if (isLoading)
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#fff" />
			</View>
		);

	return (
		<>
			<FlashList
				data={chatHistory}
				renderItem={({ item }) => <ChatLink chat={item} />}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={() => (
					<View className="h-px my-2 bg-primary-foreground" />
				)}
				scrollIndicatorInsets={{ top: headerHeight, bottom: tabHeight }}
				automaticallyAdjustsScrollIndicatorInsets={false}
				contentInsetAdjustmentBehavior="automatic"
				estimatedItemSize={50}
				// drawDistance={1000}
				ListEmptyComponent={() => (
					<View className="flex-1 items-center justify-center h-[80vh] flex flex-col gap-4 px-5">
						{searchTerm ? (
							<IconZoomCancel
								size={48}
								color={isDarkColorScheme ? "#fff" : "#000"}
							/>
						) : (
							<IconMoodEmpty
								size={48}
								color={isDarkColorScheme ? "#fff" : "#000"}
							/>
						)}
						<Text className="text-4xl">
							{searchTerm ? t("chats.no_results") : t("chats.empty")}
						</Text>
					</View>
				)}
			/>
			<FabButton
				path="chat"
				icon={() => (
					<IconPlus size={28} color={isDarkColorScheme ? "#000" : "#fff"} />
				)}
				onPress={() => {
					router.push("/(chat)/new-chat");
				}}
			/>
		</>
	);
}
