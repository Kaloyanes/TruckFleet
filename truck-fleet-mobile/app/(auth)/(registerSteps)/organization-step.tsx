import { View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "~/components/ui/text";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import { Input } from "~/components/ui/input";
import { IconBuilding } from "@tabler/icons-react-native";
import { MotiView } from "moti";
import { Button } from "~/components/ui/button";
import Animated, {
	Easing,
	withSpring,
	withTiming,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	type WithTimingConfig,
} from "react-native-reanimated";
import { useRegisterStore } from "~/stores/register-store";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function OrganizationStepPage() {
	const [organizationCode, setOrganizationCode] = React.useState("");
	const { findOrganizationId, updateValidPage } = useRegisterStore();
	const { top } = useSafeAreaInsets();

	const isTyped = useSharedValue(false);
	const timingConfig: WithTimingConfig = {
		easing: Easing.out(Easing.poly(5)),
		duration: 400,
	};

	const buttonAnimatedStyle = useAnimatedStyle(() => ({
		width: withTiming(isTyped.value ? 120 : 0, timingConfig),
		marginHorizontal: withTiming(isTyped.value ? 10 : 0, timingConfig),
		transform: [
			{ translateX: withTiming(isTyped.value ? 0 : 20, timingConfig) },
		],
	}));

	const joinOrganization = async () => {
		try {
			await findOrganizationId(organizationCode);
			toast.success("Joined company successfully");
		} catch (error) {
			console.error(error);
			toast.error("Can't find company with this code");
			return;
		}
	};

	useEffect(() => {
		updateValidPage(4, true);
	}, []);
	return (
		<View className="flex-1 items-start justify-start px-5 my-3 flex-col gap-4 w-screen">
			<Text className="text-6xl">Join a company</Text>
			<Text className="text-red-500 dark:text-red-300">
				This step is optional
			</Text>

			<View className="flex-row w-full items-center justify-between">
				<View className="flex-1 h-16">
					<Input
						placeholder="Organization code"
						className="w-full !h-16"
						icon={<IconBuilding size={20} color="#71717a" />}
						onChangeText={(text) => {
							setOrganizationCode(text.trim());
							isTyped.value = text.trim().length > 0;
						}}
						autoCorrect={false}
						autoCapitalize="none"
					/>
				</View>

				<Animated.View style={buttonAnimatedStyle} className=" overflow-hidden">
					<Button
						className="!h-[55px] w-full justify-center items-center"
						onPress={joinOrganization}
					>
						<MotiView
							animate={useDerivedValue(() => ({
								scale: isTyped.value ? 1 : 0,
							}))}
							transition={timingConfig}
						>
							<Text>Join</Text>
						</MotiView>
					</Button>
				</Animated.View>
			</View>
		</View>
	);
}
