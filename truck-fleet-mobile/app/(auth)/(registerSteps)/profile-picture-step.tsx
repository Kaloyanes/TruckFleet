import { View } from "react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import { IconPlus } from "@tabler/icons-react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";

export default function ProfilePictureStepPage() {
	return (
		<View className="flex-1 items-start justify-between px-5 my-3 flex-col gap-4 w-screen ">
			<Text className="text-6xl">Add a profile picture</Text>
			<View className="flex-[0.5]" />

			<Button
				onPress={() => {
					router.push("/(auth)/pick-image");
				}}
				size={"icon"}
				variant={"outline"}
				className="!h-64 w-64 self-center justify-self-center"
			>
				<IconPlus size={120} color={"#71717a"} />
			</Button>
			<View className="flex-1" />
		</View>
	);
}
