import { ActivityIndicator, View } from "react-native";
import React, { useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { Text } from "~/components/ui/text";

import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { LegendList } from "@legendapp/list";
import { useChatStore } from "~/stores/chat-store";
import ChatLink from "~/components/chats/ChatLink";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import FabButton from "~/components/FabButton";
import { IconPlus } from "@tabler/icons-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import useProfileDoc from "~/hooks/useProfileDoc";
import { getAuth } from "@react-native-firebase/auth";
import { useProfileStore } from "~/stores/profile-store";
export default function List() {
	const headerHeight = useHeaderHeight();
	const tabHeight = useBottomTabBarHeight();
	const router = useRouter();
	const { loadChatHistory, loadPeople, isLoading, chatHistory } =
		useChatStore();

	const { user } = useProfileStore();
	const { data: userProfile } = useProfileDoc(user.uid);

	useEffect(() => {
		loadChatHistory();
		if (userProfile?.companyId) loadPeople(userProfile.companyId);
	}, [userProfile?.companyId, loadChatHistory, loadPeople]);

	const { isDarkColorScheme } = useColorScheme();

	if (isLoading)
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#fff" />
			</View>
		);

	return (
		<View className="flex-1 relative ">
			<LegendList
				data={chatHistory}
				recycleItems
				ListHeaderComponent={
					<View
						style={{
							height: headerHeight + 10,
						}}
					/>
				}
				ListFooterComponent={<View style={{ height: tabHeight + 10 }} />}
				renderItem={({ item }) => <ChatLink chat={item} />}
				ItemSeparatorComponent={() => (
					<View className="h-px my-2 bg-primary-foreground" />
				)}
				scrollIndicatorInsets={{ top: headerHeight, bottom: tabHeight }}
				automaticallyAdjustsScrollIndicatorInsets={false}
				estimatedItemSize={50}
				drawDistance={1000}
				ListEmptyComponent={() => (
					<View
						className="flex-1 items-center justify-center h-[55vh]"
						style={{
							marginTop: headerHeight + 10,
							marginBottom: tabHeight + 10,
						}}
					>
						<Text className="text-2xl">There aren't any chats now</Text>
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
		</View>
	);
}
