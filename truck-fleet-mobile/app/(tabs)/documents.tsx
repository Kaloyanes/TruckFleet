import { View } from "react-native";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { IconCamera, IconPlus } from "@tabler/icons-react-native";
import { MotiView, useAnimationState, useDynamicAnimation } from "moti";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { usePathname } from "expo-router";
import { Easing } from "react-native-reanimated";
import FabButton from "~/components/FabButton";

export default function DocumentsPage() {
	const { isDarkColorScheme } = useColorScheme();

	return (
		<View className="flex-1 items-center justify-center relative">
			<Text>DocumentsPage</Text>

			{/* <MotiView
				className="absolute"
				state={states}
				style={{
					bottom: bottomBar + 20,
					right: 20,
				}}
				transition={{
					type: "spring",
				}}
			>
				<Button size={"icon"} className="!rounded-2xl">
					<IconPlus size={28} color={isDarkColorScheme ? "#000" : "#fff"} />
				</Button>
			</MotiView> */}
			<FabButton
				path="documents"
				icon={() => (
					<IconCamera size={28} color={isDarkColorScheme ? "#000" : "#fff"} />
				)}
				onPress={() => {}}
			/>
		</View>
	);
}
