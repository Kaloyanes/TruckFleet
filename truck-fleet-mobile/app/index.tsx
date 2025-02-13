import { IconArrowLeft, IconPackages } from "@tabler/icons-react-native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Image, useWindowDimensions, View, Text } from "react-native";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	ReduceMotion,
	Easing,
	interpolate,
	SlideInUp,
	SlideInDown,
	FadeInUp,
	FadeInDown,
	FadeIn,
} from "react-native-reanimated";
import LanguageSelector from "~/components/LanguageSelector";
import { Button } from "~/components/ui/button";
import * as Haptics from "expo-haptics";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function Screen() {
	const { t } = useTranslation();

	const { width, height } = useWindowDimensions();
	const lowerHeight = useSharedValue(0); // initially hidden

	const lowerStyle = useAnimatedStyle(() => ({
		height: lowerHeight.value,
	}));

	const getStartedButtonStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateY: interpolate(
					lowerHeight.value,
					[0, height * 0.4],
					[0, height * 0.15],
				),
			},
		],
	}));

	// New animated style for scaling the background image
	const bgImageStyle = useAnimatedStyle(() => {
		const radius = interpolate(lowerHeight.value, [0, height * 0.4], [0, 20]);
		return {
			height: interpolate(
				lowerHeight.value,
				[0, height * 0.4],
				[height, height * 0.6],
			),
			borderBottomRightRadius: radius,
			borderBottomLeftRadius: radius,
		};
	});

	const AnimatedButton = Animated.createAnimatedComponent(Button);

	return (
		<Animated.View className="flex-1 relative">
			{/* New full-screen background image with scaling */}
			<Animated.Image
				source={require("../assets/images/landing.jpg")}
				style={[
					{ position: "absolute", width: "100%", height: "100%" },
					bgImageStyle,
				]}
			/>

			{/* New logo and product text overlay */}
			<Animated.View
				entering={FadeInDown.springify()}
				style={bgImageStyle}
				className="absolute inset-0 flex flex-row items-center justify-center gap-4"
			>
				<IconPackages
					style={{
						aspectRatio: 1,
						height: "100%",
						marginBottom: 10,
					}}
					size={52}
					color={"white"}
				/>
				<Text
					className="text-white text-4xl  "
					style={{
						fontFamily: "PlayfairDisplay_600SemiBold",
					}}
				>
					Truck Fleet
				</Text>
			</Animated.View>

			<Animated.View
				entering={FadeInUp.springify()}
				className="absolute flex-1 flex flex-row gap-4 top-20 right-6 scale-110 z-50"
			>
				<LanguageSelector />
				<ThemeToggle />
			</Animated.View>

			<Animated.View className="flex-1">
				<Animated.View className="absolute left-1/2 -translate-x-1/2 bottom-14 justify-center items-center">
					<Animated.View entering={FadeInDown.springify().delay(200)}>
						<AnimatedButton
							style={getStartedButtonStyle}
							className=" w-[75vw] !h-16"
							onPress={() => {
								lowerHeight.value = withTiming(height * 0.4, {
									duration: 600,
									easing: Easing.out(Easing.bezierFn(0.92, 0, 0.75, 0.44)),
									reduceMotion: ReduceMotion.System,
								});
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
							}}
						>
							<Text
								className="text-xl text-primary-foreground"
								style={{
									fontFamily: "PlayfairDisplay_400Regular",
								}}
							>
								{t("get_started")}
							</Text>
						</AnimatedButton>
					</Animated.View>
				</Animated.View>
			</Animated.View>
			<Animated.View
				style={lowerStyle}
				className="justify-center items-center bg-background overflow-hidden"
			>
				<Button
					onPress={() => {
						lowerHeight.value = withTiming(0, {
							duration: 300,
							easing: Easing.inOut(Easing.cubic),
							reduceMotion: ReduceMotion.System,
						});
					}}
				>
					<Text className="text-primary-foreground">Reset</Text>
				</Button>
			</Animated.View>
		</Animated.View>
	);
}
