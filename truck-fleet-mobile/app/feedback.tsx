import { View } from "react-native";
import React from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner-native";
import { getFirestore } from "@react-native-firebase/firestore";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

type FeedbackForm = {
	name: string;
	feedback: string;
};

export default function Feedback() {
	const { t } = useTranslation();
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FeedbackForm>();

	const onSubmit = async (data: FeedbackForm) => {
		try {
			await getFirestore().collection("feedback").add(data);

			toast.success(t("feedback.success"));
			router.back();
		} catch (error) {
			toast.error(t("feedback.error"));
			console.error(error);
		}
	};

	return (
		<BodyScrollView contentContainerClassName="gap-4 px-4">

			<Controller
				control={control}
				name="name"
				rules={{ required: t("feedback.nameRequired") }}
				render={({ field: { onChange, value } }) => (
					<View className="w-full gap-1">
						<Input
							placeholder={t("feedback.name")}
							value={value}
							onChangeText={onChange}
							className="w-full"
						/>
						{errors.name && (
							<Text className="text-red-500 dark:text-red-300">
								{errors.name.message}
							</Text>
						)}
					</View>
				)}
			/>

			<Controller
				control={control}
				name="feedback"
				rules={{ required: t("feedback.feedbackRequired") }}
				render={({ field: { onChange, value } }) => (
					<View className="w-full gap-1">
						<Input
							placeholder={t("feedback.feedback")}
							value={value}
							onChangeText={onChange}
							multiline
							numberOfLines={4}
							className="w-full !flex-1 !h-32 align-text-top"
						/>
						{errors.feedback && (
							<Text className="text-red-500 dark:text-red-300">
								{errors.feedback.message}
							</Text>
						)}
					</View>
				)}
			/>

			<Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
				<Text>{t("feedback.submit")}</Text>
			</Button>
		</BodyScrollView>
	);
}
