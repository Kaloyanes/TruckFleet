import { View, Platform, Keyboard, Alert } from "react-native";
import React, { useState } from "react";
import { Text } from "~/components/ui/text";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { IconEye, IconEyeOff, IconMail } from "@tabler/icons-react-native";
import { Lock } from "lucide-react-native";
import { MotiScrollView, MotiView, ScrollView } from "moti";
import { FadeInDown, useDerivedValue } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import ForgotPasswordDialog from "./forgot-password";
import auth from "@react-native-firebase/auth";

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

	return (
		<View className="flex-1">
			<MotiScrollView
				animate={useDerivedValue(() => ({
					translateY: keyboardHeight.value * 0.4,
				}))}
				transition={{
					type: "no-animation",
				}}
				contentContainerClassName="flex-1 justify-center items-center gap-4"
				className=" flex-1 px-5 my-3 flex-col gap-4"
			>
				<Text className="text-6xl text-center">{t("welcome_back")}</Text>

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
							{errors.email && (
								<Text className="text-red-500 text-sm px-1 mt-1">
									{errors.email.message}
								</Text>
							)}
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
				<ForgotPasswordDialog />
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
