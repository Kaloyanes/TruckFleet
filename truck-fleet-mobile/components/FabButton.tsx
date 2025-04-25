import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { MotiView, useAnimationState } from "moti";
import { Button } from "./ui/button";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { usePathname } from "expo-router";

export default function FabButton({
	path,
	icon,
	onPress,
}: { path: string; icon: () => JSX.Element; onPress: () => void }) {
	const tabHeight = useBottomTabBarHeight();
	const pathName = usePathname();

	const states = useAnimationState({
		from: {
			opacity: 0,
			scale: 0.5,
			translateY: 150,
		},
		to: {
			opacity: 1,

			scale: 1,
			translateY: 0,
		},
	});

	useEffect(() => {
		if (pathName.includes(path)) {
			states.transitionTo("to");
		} else {
			states.transitionTo("from");
		}
	}, [pathName, states.transitionTo, path]);

	return (
		<MotiView
			className="absolute shadow-[0px_0px_20px_0px_rgba(0,0,0,0.5)] shadow-primary"
			state={states}
			style={{
				bottom: tabHeight + 20,
				right: 20,
			}}
			transition={{
				type: "spring",
				scale: {
					delay: 50,
				},
			}}
		>
			<Button size={"icon"} className="!p-7 " onPress={onPress}>
				{icon()}
			</Button>
		</MotiView>
	);
}
