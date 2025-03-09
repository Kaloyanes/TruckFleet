import { View } from "react-native";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { IconPlus } from "@tabler/icons-react-native";
import { MotiView, useAnimationState, useDynamicAnimation } from "moti";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { usePathname } from "expo-router";
import { Easing } from "react-native-reanimated";

export default function DocumentsPage() {
	const bottomBar = useBottomTabBarHeight();
	const { isDarkColorScheme } = useColorScheme();
	const pathName = usePathname();

	const states = useAnimationState({
		from: {
			scale: 0.2,
			translateY: 200,
		},
		to: {
			scale: 1,
			translateY: 0,
		},
	});

	useEffect(() => {
		if (pathName.includes("documents")) {
			states.transitionTo("to");
		} else {
			states.transitionTo("from");
		}
	}, [pathName, states.transitionTo]);

	return (
		<View className="flex-1 items-center justify-center relative">
			<Text>DocumentsPage</Text>

			<MotiView
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
				<Button size={"icon"} className="!p-7">
					<IconPlus size={30} color={isDarkColorScheme ? "#000" : "#fff"} />
				</Button>
			</MotiView>
		</View>
	);
}
