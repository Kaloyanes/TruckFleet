import { type TextInput, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useRegisterStore } from "~/stores/register-store";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPhone } from "@tabler/icons-react-native";
import { useTranslation } from "react-i18next";

export default function PhoneStepPage() {
	const { t } = useTranslation();

	const phoneStepSchema = z.object({
		phone: z
			.string()
			.min(1, t("invalid_phone"))
			.regex(/^\+[1-9]\d{7,14}$/, t("invalid_phone")),
	});

	type PhoneStepFormData = z.infer<typeof phoneStepSchema>;

	const { formData, updateFormData, updateValidPage } = useRegisterStore();
	const phoneRef = useRef<TextInput>(null);

	const {
		control,
		formState: { errors },
		watch,
	} = useForm<PhoneStepFormData>({
		resolver: zodResolver(phoneStepSchema),
		defaultValues: {
			phone: formData.phone || "+",
		},
		mode: "onChange",
	});

	useEffect(() => {
		const subscription = watch((value) => {
			if (value?.phone) {
				updateFormData({ phone: value.phone });
				const result = phoneStepSchema.safeParse({ phone: value.phone });
				console.log("Phone validation result:", result.success, value.phone); // Debug log
				updateValidPage(2, result.success);
			} else {
				updateValidPage(2, false);
			}
		});

		// Initial validation
		const currentPhone = watch("phone");
		if (currentPhone) {
			const result = phoneStepSchema.safeParse({ phone: currentPhone });
			updateValidPage(2, result.success);
		}

		return () => subscription.unsubscribe();
	}, [watch, updateFormData, updateValidPage]);

	return (
		<View className="flex-1 items-start justify-start px-5 my-3 flex-col gap-4 w-screen">
			<Text className="text-6xl">{t("phone_number")}</Text>

			<Controller
				control={control}
				name="phone"
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="w-full gap-1">
						<Input
							ref={phoneRef}
							placeholder={t("phone")}
							value={value}
							onChangeText={(text) => {
								const sanitizedText = text
									.replace(/[^\d+]/g, "")
									.replace(/^(?!\+)/, "+");
								onChange(sanitizedText);
							}}
							onBlur={onBlur}
							className="!w-full !h-16"
							keyboardType="phone-pad"
							autoComplete="tel"
							returnKeyType="done"
							icon={<IconPhone size={20} color="#71717a" />}
						/>
						<Text className="text-zinc-500 text-sm px-1">
							{t("include_country_code")} (e.g. +359)
						</Text>
						{errors.phone && (
							<Text className="text-red-500 text-sm px-1 mt-1">
								{errors.phone.message}
							</Text>
						)}
					</View>
				)}
			/>
		</View>
	);
}
