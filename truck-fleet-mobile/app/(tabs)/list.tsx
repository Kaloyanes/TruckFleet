import { View } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { Text } from "~/components/ui/text";

export default function list() {
	return (
		<View className="flex-1 ">
			<FlashList
				data={new Array(2500).fill(null).map((_, i) => (i + 1).toString())}
				renderItem={({ item }) => (
					<Text className="text-2xl text-center">{item}</Text>
				)}
				estimatedItemSize={28}
			/>
		</View>
	);
}
