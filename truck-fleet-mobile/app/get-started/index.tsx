import { View, FlatList, Animated } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

function GetStartedScreen() {
	const items = [
		{
			id: "1",
			render: () => {
				return (
					<View className="flex-1 py-10 w-full">
						<Text className="text-7xl px-10">Introduce Yourself</Text>
					</View>
				);
			},
		},
		{
			id: "2",
			render: () => {
				return (
					<View className="flex-1 py-10">
						<Text className="text-7xl px-10">Introduce Yourself</Text>
					</View>
				);
			},
		},
	];

	return (
		<View className="flex-1">
			<FlatList
				horizontal
				style={{ width: "100%", height: "100%" }}
				data={items}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => item.render()}
			/>
			<Button
				onPress={() => {}}
				className="w-[80%] rounded-xl h-16 justify-center items-center absolute bottom-safe "
			>
				<Text className="!text-lg">Get Started</Text>
			</Button>
		</View>
	);
}

export default GetStartedScreen;
