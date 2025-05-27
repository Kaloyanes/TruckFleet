import { View } from "react-native";
import React from "react";
import type { Chat } from "~/stores/chat-store";
import { Text } from "../ui/text";
import { getAuth } from "@react-native-firebase/auth";
import useProfileDoc from "~/hooks/useProfileDoc";
import { Button } from "../ui/button";
import { router } from "expo-router";
import { Image } from "../ui/image";
import Animated from "react-native-reanimated";
import { format } from "date-fns";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function ChatLink({ chat }: { chat: Chat }) {
	const currentUser = getAuth().currentUser;
	const otherUser = chat.participants.find((user) => user !== currentUser?.uid);

	const { data, isLoading, error } = useProfileDoc(otherUser || "");

	if (isLoading) {
		return null;
	}
	console.log(data);

	return (
		<Button
			variant={"ghost"}
			className="w-full gap-4 !h-16 flex flex-row !items-center"
			onPress={() => {
				router.push({
					pathname: "/(chat)/[id]",
					params: {
						id: chat.id,
						personId: otherUser,
					},
				});
			}}
		>
			<Image source={data?.photoUrl} className="w-14 h-14 rounded-full" />
			<Text className="!text-xl flex-1">{data?.name}</Text>
			<View className="flex-1 items-end flex flex-col">
				<Text>{format(chat.lastMessageAt, "HH:MM")}</Text>
				<Text className="font-light tracking-[0.5px]">
					{format(chat.lastMessageAt, "dd/MM/yyyy")}
				</Text>
			</View>
		</Button>
	);
}
