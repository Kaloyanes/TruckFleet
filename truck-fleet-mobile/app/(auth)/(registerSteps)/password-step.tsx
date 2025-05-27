import { View, type TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react"; // Added useState import
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useRegisterStore } from "~/stores/register-store";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react-native"; // Example import, replace with your icon library
import { Button } from "~/components/ui/button";
import { IconEye, IconEyeOff } from "@tabler/icons-react-native"; // Added IconEyeOff import
import { useTranslation } from "react-i18next"; // Added useTranslation import

// Define validation schema
const passwordStepSchema = z
	.object({
		password: z
			.string()
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number")
			.min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type PasswordStepFormData = z.infer<typeof passwordStepSchema>;

export default function PasswordStepPage() {
	// Added state to toggle password visibility
	const { t } = useTranslation();
	const [showPassword, setShowPassword] = useState(false);

	const { formData, updateFormData, updateValidPage } = useRegisterStore();
	const confirmPasswordRef = useRef<TextInput>(null);

	const {
		control,
		formState: { errors, isDirty, touchedFields },
		watch,
	} = useForm<PasswordStepFormData>({
		resolver: zodResolver(passwordStepSchema),
		defaultValues: {
			password: formData.password || "",
			confirmPassword: "",
		},
		mode: "onChange", // Validate on change
		reValidateMode: "onChange", // Re-validate on change
	});

	// Update store when form values change
	useEffect(() => {
		const subscription = watch((value) => {
			if (value) {
				updateFormData({
					password: value.password,
				});
			}

			const result = passwordStepSchema.safeParse(value);
			updateValidPage(1, result.success);
		});

		return () => subscription.unsubscribe();
	}, [watch, updateFormData, updateValidPage]);

	return (
		<View className="flex-1 items-start justify-start px-5 my-3 flex-col gap-4 w-screen">
			<Text className="text-6xl">{t("create_secured_password")}</Text>

			<Controller
				control={control}
				name="password"
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="w-full gap-1">
						<Input
							placeholder={t("password")}
							value={value}
							onChangeText={(text) => {
								onChange(text);
								console.log("Password validation:", errors.password?.message);
							}}
							onBlur={onBlur}
							secureTextEntry={!showPassword}
							keyboardType="visible-password"
							aria-labelledby="passwordLabel"
							aria-errormessage="passwordError"
							className="!w-full !h-16"
							returnKeyType="next"
							onSubmitEditing={() => confirmPasswordRef.current?.focus()}
							icon={<Lock size={20} color="#71717a" />}
							trailingIcon={
								<Button
									size="icon"
									variant="outline"
									onPress={() => setShowPassword((prev) => !prev)}
								>
									{showPassword ? (
										<IconEyeOff color={"#71717a"} />
									) : (
										<IconEye color={"#71717a"} />
									)}
								</Button>
							}
						/>
						{errors.password ? (
							<Text className="text-red-500 text-sm px-1 mt-1">
								{errors.password.message}
							</Text>
						) : (
							<View className="h-0" />
						)}
					</View>
				)}
			/>

			<Controller
				control={control}
				name="confirmPassword"
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="w-full gap-1">
						<Input
							ref={confirmPasswordRef}
							placeholder={t("confirm_password")}
							value={value}
							onChangeText={(text) => {
								onChange(text);
								console.log(
									"Confirm password validation:",
									errors.confirmPassword?.message,
								);
							}}
							onBlur={onBlur}
							keyboardType="visible-password"
							secureTextEntry={!showPassword}
							aria-labelledby="confirmPasswordLabel"
							aria-errormessage="confirmPasswordError"
							className="!w-full !h-16"
							returnKeyType="done"
							icon={<Lock size={20} color="#71717a" />}
							trailingIcon={
								<Button
									size="icon"
									variant="outline"
									onPress={() => setShowPassword((prev) => !prev)}
								>
									{showPassword ? (
										<IconEyeOff color={"#71717a"} />
									) : (
										<IconEye color={"#71717a"} />
									)}
								</Button>
							}
						/>
						{errors.confirmPassword ? (
							<Text className="text-red-500 text-sm px-1 mt-1">
								{errors.confirmPassword.message}
							</Text>
						) : (
							<View className="h-0" />
						)}
					</View>
				)}
			/>

			<Text className="text-sm text-muted-foreground">
				{t("password_requirements")}
			</Text>
		</View>
	);
}
