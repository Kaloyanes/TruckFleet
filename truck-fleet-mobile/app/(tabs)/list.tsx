import { View } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { Text } from "~/components/ui/text";

import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { LegendList } from "@legendapp/list";
export default function List() {
	const headerHeight = useHeaderHeight();
	const tabHeight = useBottomTabBarHeight();
	const router = useRouter();
	return (
		<View className="flex-1 ">
			<LegendList
				recycleItems
				data={new Array(2500).fill(null).map((_, i) => (i + 1).toString())}
				ListHeaderComponent={
					<View
						style={{
							height: headerHeight + 10,
						}}
					/>
				}
				ListFooterComponent={<View style={{ height: tabHeight + 10 }} />}
				renderItem={({ item }) => (
					<Text
						onPress={() => router.push("/(auth)/login")}
						className="text-2xl text-center"
					>
						{item}
					</Text>
				)}
				scrollIndicatorInsets={{ top: headerHeight, bottom: tabHeight }}
				automaticallyAdjustsScrollIndicatorInsets={false}
				estimatedItemSize={28}
			/>
		</View>
	);
}
