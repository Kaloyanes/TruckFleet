import { IconArrowLeft, IconPackages } from "@tabler/icons-react-native";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions, View } from "react-native";
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
import { IconMail } from "~/lib/icons/Mail";
import LanguageSelector from "~/components/LanguageSelector";
import { Button } from "~/components/ui/button";
import * as Haptics from "expo-haptics";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { Image, ImageSource, useImage } from "expo-image";

export default function OnBoardPage() {
	const { t } = useTranslation();

	const { width, height } = useWindowDimensions();
	const lowerHeight = useSharedValue(0); // initially hidden
	const bgImageHook = useImage(require("~/assets/images/landing.jpg"), {});

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
		const radius = interpolate(lowerHeight.value, [0, height * 0.4], [0, 40]);
		return {
			height: interpolate(
				lowerHeight.value,
				[0, height * 0.4],
				[height, height * 0.6],
			),
			borderBottomRightRadius: radius,
			borderBottomLeftRadius: radius,
			borderCurve: "continuous",
		};
	});

	const AnimatedButton = Animated.createAnimatedComponent(Button);
	const AnimatedImage = Animated.createAnimatedComponent(Image);
	const router = useRouter();

	return (
		<Animated.View className="flex-1 relative">
			{/* New full-screen background image with scaling */}
			<AnimatedImage
				source={bgImageHook}
				transition={{
					effect: "cross-dissolve",
					duration: 200,
					timing: "ease-out",
				}}
				style={[
					{ position: "absolute", width: "100%", height: "100%" },
					bgImageStyle,
				]}
				priority={"high"}
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
				<Text className="font-[600] text-4xl text-white">Truck Fleet</Text>
			</Animated.View>

			<Animated.View
				entering={FadeInUp.springify()}
				className="absolute top-20 right-6 z-50 flex flex-1 scale-110 flex-row gap-4"
			>
				<LanguageSelector />
				<ThemeToggle />
			</Animated.View>

			<Animated.View className="flex-1">
				<Animated.View className="-translate-x-1/2 absolute bottom-14 left-1/2 items-center justify-center">
					<Animated.View entering={FadeInDown.springify().delay(200)}>
						<AnimatedButton
							style={getStartedButtonStyle}
							className=" !h-16 w-[75vw] items-center justify-center"
							onPress={() => {
								lowerHeight.value = withTiming(height * 0.4, {
									duration: 600,
									easing: Easing.out(Easing.bezierFn(0.92, 0, 0.75, 0.44)),
									reduceMotion: ReduceMotion.System,
								});
							}}
						>
							<Text className="!text-xl font-normal text-primary-foreground">
								{t("get_started")}
							</Text>
						</AnimatedButton>
					</Animated.View>
				</Animated.View>
			</Animated.View>

			<Animated.View
				style={lowerStyle}
				className="flex flex-col items-center justify-evenly overflow-hidden bg-background"
			>
				<View className="flex w-full flex-row items-center justify-center gap-2 px-4">
					<Text className="text-3xl">{t("create_account")}</Text>
					<Text className="font-semibold text-3xl italic">{t("account")}</Text>
				</View>

				<Button
					onPress={() => {
						router.push("/(auth)/register");
					}}
					className=" w-[75vw] !h-16 flex-row gap-4 justify-between"
				>
					<IconMail size={24} className="text-primary-foreground" />
					<Text className="text-primary-foreground !text-xl ">
						{t("continue_with_email")}
					</Text>
					<View className="" />
				</Button>
				<View className="flex flex-row items-center justify-center w-full px-4 gap-2">
					<Text className="text-lg">{t("already_have_account")}</Text>
					<Button
						onPress={() => {
							router.push("/(auth)/login");
						}}
						variant={"link"}
						className="!h-16"
					>
						<Text className="!text-lg font-bold">{t("sign_in")}</Text>
					</Button>
				</View>
			</Animated.View>
		</Animated.View>
	);
}
