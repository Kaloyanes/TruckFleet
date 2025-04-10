import {
	View,
	Platform,
	Switch,
	ActivityIndicator,
	Vibration,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { useHeaderHeight } from "@react-navigation/elements";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import { router, Stack, useNavigation } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDocumentStore } from "~/stores/document-store";
import { getAuth } from "@react-native-firebase/auth";
import { trigger } from "react-native-haptic-feedback";
import { useTranslation } from "react-i18next";
import { Image } from "~/components/ui/image";
import { useColorScheme } from "~/lib/useColorScheme";
import { IconClearAll, IconX } from "@tabler/icons-react-native";
import { AnimatePresence, MotiView } from "moti";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";

const formSchema = z.object({
	name: z.string().min(1, "document_name_required"),
	documentUri: z.string().optional(),
	documentType: z.enum(["document", "picture"]).default("document"),
});

type FormData = z.infer<typeof formSchema>;

export default function NewDocument() {
	const { isDarkColorScheme } = useColorScheme();
	const { t } = useTranslation();
	const { addDocument, isLoading, currentDoc, setCurrentDoc } =
		useDocumentStore();

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			documentType: undefined,
		},
	});

	async function chooseDocument() {
		const result = await DocumentPicker.getDocumentAsync({
			type: ["application/pdf"],
		});

		if (result.canceled === false && result.assets && result.assets[0]) {
			setCurrentDoc({
				name: result.assets[0].name,
				type: "document",
				uri: result.assets[0].uri,
			});
		}
	}

	const onSubmit = async (formData: FormData) => {
		try {
			if (!formData.name) {
				return;
			}

			await addDocument();

			router.back();
		} catch (error) {
			console.error("Error creating document:", error);
		}
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<Button
							variant={"outline"}
							size={"icon"}
							onPress={() => {
								setCurrentDoc(null);
							}}
						>
							<IconClearAll
								size={24}
								color={isDarkColorScheme ? "#fff" : "#000"}
							/>
						</Button>
					),
				}}
			/>
			<View className="flex-1">
				<BodyScrollView className="flex-1 w-full flex-col h-[50vh] space-y-4 px-4 relative">
					{Platform.OS === "android" && (
						<View className="w-full items-center">
							<View className="w-12 h-1 bg-gray-400 rounded-full my-2" />
						</View>
					)}

					<View className="w-full flex-1 flex flex-col gap-6">
						<Controller
							control={control}
							name="name"
							render={({ field: { onChange, value } }) => (
								<>
									<Input
										placeholder={t("document_name")}
										className="w-full"
										value={value}
										onChangeText={onChange}
									/>
									{errors.name && (
										<Text className="text-red-500 text-sm mt-1">
											{t(errors.name.message || "document_name_required")}
										</Text>
									)}
								</>
							)}
						/>

						{/* Preview Section */}
						<AnimatePresence>
							{currentDoc?.uri && (
								<MotiView
									className="w-full border border-border rounded-2xl p-2 flex-row items-start gap-3"
									key={currentDoc.uri}
									from={{ opacity: 0, height: 0, scale: 0.9, translateY: -15 }}
									animate={{
										opacity: 1,
										height: "auto",
										scale: 1,
										translateY: 0,
									}}
									exit={{ opacity: 0, height: 0, scale: 0.9, translateY: -15 }}
									transition={{
										type: "timing",
										duration: 400,
										easing: Easing.out(Easing.poly(4)),
									}}
								>
									<View className="w-32 h-32 rounded-lg overflow-hidden">
										{currentDoc.type === "picture" ? (
											<Image
												source={{ uri: currentDoc.uri }}
												className="w-full h-full rounded-xl"
											/>
										) : currentDoc.type === "document" ? (
											<View className="w-full h-full bg-secondary items-center justify-center">
												<Text className="text-muted-foreground text-xs">
													PDF
												</Text>
											</View>
										) : (
											<View className="w-full h-full bg-gray-100 items-center justify-center">
												<Text className="text-muted-foreground text-xs">
													Unknown
												</Text>
											</View>
										)}
									</View>
									<View className="flex-1 py-2">
										<Text className="font-medium">{currentDoc.name}</Text>
										<Text className="text-muted-foreground text-sm capitalize">
											{t("type")}: {t(currentDoc.type)}
										</Text>
									</View>
								</MotiView>
							)}
						</AnimatePresence>

						<Animated.View
							layout={LinearTransition.easing(
								Easing.out(Easing.poly(4)),
							).duration(400)}
							className="flex flex-col gap-4"
						>
							<View className="w-full flex flex-row items-center justify-between gap-4">
								<Button
									size={"lg"}
									className="flex-1"
									onPress={chooseDocument}
									variant={
										currentDoc?.type === "document" ? "default" : "outline"
									}
								>
									<Text>
										{currentDoc?.type === "document"
											? t("document_selected")
											: t("documents")}
									</Text>
								</Button>
								<Button
									onPress={() => {
										trigger("impactLight");
										setValue("documentType", "picture");
										router.push("/(tabs)/documents/pick-image");
									}}
									size={"lg"}
									className="flex-1"
									variant="outline"
								>
									<Text>{t("pick_image")}</Text>
								</Button>
							</View>
							<Button
								className="w-full h-14"
								size="lg"
								onPress={handleSubmit(onSubmit)}
								disabled={isLoading || isSubmitting}
							>
								{isLoading ? (
									<ActivityIndicator color="white" />
								) : (
									<Text className="text-primary-foreground font-semibold">
										{t("create_document")}
									</Text>
								)}
							</Button>
						</Animated.View>
					</View>
				</BodyScrollView>
			</View>
		</>
	);
}
