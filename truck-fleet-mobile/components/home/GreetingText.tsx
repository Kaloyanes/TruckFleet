import { ActivityIndicator, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { getDoc, doc } from "firebase/firestore";
import { Text } from "../ui/text";
import useProfileDoc from "~/hooks/useProfileDoc";
import { getAuth } from "@react-native-firebase/auth";

export default function GreetingText() {
	const { data, isLoading } = useProfileDoc(getAuth().currentUser?.uid ?? "");

	const getGreetingKey = () => {
		const hours = new Date().getHours();
		if (hours < 12) return "good_morning";
		if (hours < 17) return "good_afternoon";
		return "good_evening";
	};
	const { t } = useTranslation();

	if (isLoading)
		return (
			<View className="h-[100px] items-center justify-center">
				<ActivityIndicator />
			</View>
		);

	return (
		<View className="flex flex-col justify-center px-5">
			<Text className="text-6xl ">{t(getGreetingKey())},</Text>
			<Text className="text-6xl">{(data?.name as string).split(" ")[0]}</Text>
		</View>
	);
}
