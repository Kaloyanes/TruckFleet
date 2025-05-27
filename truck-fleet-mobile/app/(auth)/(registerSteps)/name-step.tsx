import { type TextInput, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useColorScheme } from "~/lib/useColorScheme";
import { useRegisterStore } from "~/stores/register-store";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconMail, IconUser } from "@tabler/icons-react-native";
import { useTranslation } from "react-i18next";

// Define validation schema
const nameStepSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
});

type NameStepFormData = z.infer<typeof nameStepSchema>;

export default function NameStepPage() {
	const { t } = useTranslation();
	const { isDarkColorScheme } = useColorScheme();
	const { formData, updateFormData, updateValidPage } = useRegisterStore();
	const emailRef = useRef<TextInput>(null);

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<NameStepFormData>({
		resolver: zodResolver(nameStepSchema),
		defaultValues: {
			name: formData.name || "",
			email: formData.email || "",
		},
		mode: "onChange", // Validate on change
		reValidateMode: "onChange",
	});

	useEffect(() => {
		const subscription = watch((value) => {
			if (value) {
				updateFormData({
					name: value.name,
					email: value.email,
				});
			}

			const result = nameStepSchema.safeParse(value);
			updateValidPage(0, result.success);

			// Check form validity against schema

			// Disable button if form is invalid, enable if valid
		});

		return () => subscription.unsubscribe();
	}, [watch, updateFormData, updateValidPage]);

	return (
		<View className="flex-1 items-start justify-start px-5 my-3 flex-col gap-4 w-screen">
			<Text className="text-6xl">{t("introduce_yourself")}</Text>

			<Controller
				control={control}
				name="name"
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="w-full gap-1">
						<Input
							placeholder={t("name")}
							value={value}
							onChangeText={(text) => {
								onChange(text);
								console.log("Name validation:", errors.name?.message);
							}}
							onBlur={onBlur}
							aria-labelledby="nameLabel"
							aria-errormessage="nameError"
							className="!w-full !h-16"
							returnKeyType="next"
							autoCapitalize="words"
							autoComplete="name"
							onSubmitEditing={() => {
								emailRef.current?.focus();
							}}
							icon={<IconUser size={20} color="#71717a" />}
						/>
						{errors.name ? (
							<Text className="text-red-500 text-sm px-1 mt-1">
								{errors.name.message}
							</Text>
						) : (
							<View className="h-0" />
						)}
					</View>
				)}
			/>

			<Controller
				control={control}
				name="email"
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="w-full gap-1">
						<Input
							ref={emailRef}
							placeholder={t("email")}
							value={value}
							onChangeText={(text) => {
								onChange(text);
								console.log("Email validation:", errors.email?.message);
							}}
							onBlur={onBlur}
							aria-labelledby="emailLabel"
							aria-errormessage="emailError"
							className="!w-full !h-16"
							keyboardType="email-address"
							autoComplete="email"
							returnKeyType="none"
							autoCapitalize="none"
							icon={<IconMail size={20} color="#71717a" />}
						/>
						{errors.email ? (
							<Text className="text-red-500 text-sm px-1 mt-1">
								{errors.email.message}
							</Text>
						) : (
							<View className="h-0" />
						)}
					</View>
				)}
			/>
		</View>
	);
}
