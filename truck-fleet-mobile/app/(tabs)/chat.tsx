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
export default function List() {
	const headerHeight = useHeaderHeight();
	const tabHeight = useBottomTabBarHeight();
	const router = useRouter();
	const { loadChatHistory, isLoading, chatHistory } = useChatStore();

	useEffect(() => {
		loadChatHistory();
	}, []);

	if (isLoading)
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#fff" />
			</View>
		);

	return (
		<View className="flex-1 ">
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
				ListEmptyComponent={
					<View className="h-[65vh] w-full  flex-1 items-center justify-center">
						<Text className="text-xl">There aren't any chats now</Text>
					</View>
				}
			/>
		</View>
	);
}
