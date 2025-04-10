import { Platform, Pressable, View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { IconCamera, IconPhoto } from "@tabler/icons-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRegisterStore } from "~/stores/register-store";
import { useColorScheme } from "~/lib/useColorScheme";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { LegendList } from "@legendapp/list";
import { useChatStore } from "~/stores/chat-store";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "~/components/ui/image";
import { Button } from "~/components/ui/button";
import { firebase } from "@react-native-firebase/firestore";
import { FlashList } from "@shopify/flash-list";

export default function NewChatModal() {
	const { t } = useTranslation();

	const { isDarkColorScheme } = useColorScheme();

	const iconColor = isDarkColorScheme ? "#fff" : "#71717a";

	const headerHeight = useHeaderHeight();

	const { people, chatHistory, originalChatHistory } = useChatStore();

	function createChat(personId: string) {
		const currentUser = firebase.auth().currentUser;
		if (!currentUser) {
			console.error("No current user found");
			return;
		}
		const userId = currentUser.uid;

		firebase
			.firestore()
			.collection("chats")
			.add({
				participants: [personId, userId],
				lastMessageAt: new Date(),
				createdAt: new Date(),
			})
			.then((doc) => {
				console.log(doc.id);
				router.back();
				router.push({
					pathname: "/(chat)/[id]",
					params: {
						id: doc.id,
						personId,
					},
				});
			});
	}

	return (
		<View className="flex-1 w-full flex-col h-screen android:h-[80vh]">
			{Platform.OS === "android" && (
				<View className="w-full items-center">
					<View className="w-12 h-1 bg-gray-400 rounded-full my-2" />
				</View>
			)}
			<FlashList
				className="flex-1 "
				data={people.filter(
					(person) =>
						!originalChatHistory.find((chat) =>
							chat.participants.includes(person.id),
						),
				)}
				keyExtractor={(item) => item.id}
				contentInsetAdjustmentBehavior="automatic"
				automaticallyAdjustContentInsets
				renderItem={({ item }) => (
					<Button
						variant={"ghost"}
						onPress={() => createChat(item.id)}
						className="flex-row items-center justify-between !p-6"
					>
						<View className="flex-row items-center gap-3">
							<Image
								source={item.photoUrl}
								className="w-12 h-12 rounded-full object-cover"
								contentFit="cover"
								transition={100}
							/>

							<Text className="font-bold text-xl">{item.name}</Text>
						</View>
					</Button>
				)}
				ItemSeparatorComponent={() => <View className="h-2" />}
				estimatedItemSize={56}
			/>
		</View>
	);
}
