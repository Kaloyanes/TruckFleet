import { View, Platform, Keyboard, Alert } from "react-native";
import React, { useState } from "react";
import { Text } from "~/components/ui/text";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
	IconEye,
	IconEyeOff,
	IconMail,
	IconMoodSmile,
} from "@tabler/icons-react-native";
import { Lock } from "lucide-react-native";
import { AnimatePresence, MotiScrollView, MotiView, ScrollView } from "moti";
import {
	FadeInDown,
	LinearTransition,
	useDerivedValue,
} from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import ForgotPasswordDialog from "./forgot-password";
import auth from "@react-native-firebase/auth";
import { useColorScheme } from "~/lib/useColorScheme";

export default function LoginPage() {
	const { t } = useTranslation();

	const loginSchema = z.object({
		email: z.string().email(t("invalid_email")),
		password: z.string().min(1, t("password_required")),
	});
	type LoginFormData = z.infer<typeof loginSchema>;
	const [showPassword, setShowPassword] = useState(false);
	const { bottom } = useSafeAreaInsets();
	const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			Keyboard.dismiss();
			await auth().signInWithEmailAndPassword(data.email, data.password);
			router.dismissAll();
			router.replace("/(tabs)", {});
		} catch (error: any) {
			let errorMessage = "An error occurred during sign in";

			switch (error.code) {
				case "auth/invalid-email":
					errorMessage = "Invalid email address";
					break;
				case "auth/user-disabled":
					errorMessage = "This account has been disabled";
					break;
				case "auth/user-not-found":
				case "auth/wrong-password":
					errorMessage = "Invalid email or password";
					break;
			}

			Alert.alert("Sign In Error", errorMessage);
			console.error(error);
		}
	};
	const { isDarkColorScheme } = useColorScheme();

	return (
		<View className="flex-1">
			<MotiScrollView
				layout={LinearTransition.springify().damping(10).stiffness(100)}
				animate={useDerivedValue(() => ({
					translateY: keyboardHeight.value * 0.4,
				}))}
				transition={{
					type: "no-animation",
				}}
				contentContainerClassName="flex-1 justify-center items-center gap-4"
				className=" flex-1 px-5 my-3 flex-col gap-4"
			>
				<View className="flex w-full flex-row items-center justify-between ">
					<Text className="text-5xl flex-1">Login To Your Account</Text>
					<IconMoodSmile
						size={64}
						style={{ flex: 1 }}
						color={isDarkColorScheme ? "#fff" : "#000"}
					/>
				</View>

				<Controller
					control={control}
					name="email"
					render={({ field: { onChange, onBlur, value } }) => (
						<View className="w-full gap-1">
							<Input
								placeholder={t("email")}
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								className="!w-full !h-16"
								keyboardType="email-address"
								autoComplete="email"
								autoCapitalize="none"
								icon={<IconMail size={20} color="#71717a" />}
							/>
							<AnimatePresence presenceAffectsLayout>
								{errors.email && (
									<MotiView
										from={{
											height: 0,
											opacity: 0,
										}}
										animate={{
											height: 15,
											opacity: 1,
										}}
										exit={{
											opacity: 0,
											height: 0,
										}}
									>
										<Text className="text-red-500 text-sm px-1 mt-1">
											{errors.email.message}
										</Text>
									</MotiView>
								)}
							</AnimatePresence>
						</View>
					)}
				/>

				<Controller
					control={control}
					name="password"
					render={({ field: { onChange, onBlur, value } }) => (
						<View className="w-full gap-1">
							<Input
								placeholder={t("password")}
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								secureTextEntry={!showPassword}
								className="!w-full !h-16"
								icon={<Lock size={20} color="#71717a" />}
								trailingIcon={
									<Button
										size="icon"
										variant="outline"
										onPress={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? (
											<IconEyeOff color="#71717a" />
										) : (
											<IconEye color="#71717a" />
										)}
									</Button>
								}
							/>
							{errors.password && (
								<Text className="text-red-500 text-sm px-1 mt-1">
									{errors.password.message}
								</Text>
							)}
						</View>
					)}
				/>
				<Link href="/(auth)/forgot-password" asChild>
					<Button variant="link" className="self-end px-0">
						<Text className="text-primary">{t("forgot_password")}</Text>
					</Button>
				</Link>
			</MotiScrollView>

			<MotiView
				style={{
					transform: [
						{
							translateY: keyboardHeight,
						},
					],
				}}
			>
				<View
					className="absolute left-1/2 -translate-x-1/2 justify-center items-center"
					style={{
						bottom: Platform.OS === "ios" ? bottom : bottom + 25,
					}}
				>
					<Button
						className="w-[75vw] !h-16 items-center justify-center"
						onPress={handleSubmit(onSubmit)}
						disabled={!isValid}
					>
						<Text
							className="!text-xl text-primary-foreground"
							style={{
								fontFamily: "PlayfairDisplay_400Regular",
							}}
						>
							{t("sign_in")}
						</Text>
					</Button>
				</View>
			</MotiView>
		</View>
	);
}
