import { View } from "react-native";
import React from "react";
import type { Chat } from "~/stores/chat-store";
import { Text } from "../ui/text";
import { getAuth } from "@react-native-firebase/auth";
import useProfileDoc from "~/hooks/useProfileDoc";
import { Button } from "../ui/button";
import { Image, useImage } from "expo-image";

export default function ChatLink({ chat }: { chat: Chat }) {
	const currentUser = getAuth().currentUser;
	const otherUser = chat.participants.find((user) => user !== currentUser?.uid);

	const { data, isLoading, error } = useProfileDoc(otherUser || "");

	if (isLoading) {
		return null;
	}

	return (
		<Button variant={"ghost"} className="w-full flex-row">
			<Image
				source={{ uri: data?.photoUrl }}
				className="w-12 h-12 rounded-full"
			/>
			<View className="flex-1 h-full w-full">
				<Text className="text-xl">{data?.name}</Text>
			</View>
		</Button>
	);
}
