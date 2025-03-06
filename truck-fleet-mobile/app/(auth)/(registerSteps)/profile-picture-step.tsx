import { View, Image } from "react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import { IconPlus } from "@tabler/icons-react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { useRegisterStore } from "~/stores/register-store";
import { useTranslation } from "react-i18next";

export default function ProfilePictureStepPage() {
	const { t } = useTranslation();
	const { profilePicture } = useRegisterStore();
	return (
		<View className="flex-1 items-start px-5 my-3 flex-col gap-4 w-screen ">
			<Text className="text-6xl">{t("add_profile_picture")}</Text>

			<View className="flex-1 w-full h-[60vh] flex-col  justify-center items-center">
				<Button
					onPress={() => {
						router.push("/(auth)/pick-image");
					}}
					size={"icon"}
					variant={"outline"}
					className="!h-64 w-64 self-center justify-self-center overflow-hidden"
				>
					{profilePicture !== null && (
						<Image
							source={{ uri: profilePicture.uri }}
							className="flex-1 w-full"
						/>
					)}

					{profilePicture === null && <IconPlus size={120} color={"#71717a"} />}
				</Button>
			</View>
		</View>
	);
}
