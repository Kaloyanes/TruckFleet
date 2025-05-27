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
import Animated, {
	Easing,
	LinearTransition,
	FadeIn,
	FadeOut,
	SlideInRight,
	SlideOutLeft,
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import { AnimatePresence, MotiText, MotiView } from "moti";

const formSchema = z.object({
	name: z
		.string()
		.min(1, "document_name_required")
		.max(100, "document_name_too_long")
		.regex(/^[a-zA-Z0-9\s\-_]+$/, "document_name_invalid_chars"),
	documents: z.array(z.any()).min(1, "documents_required"),
});

type FormData = z.infer<typeof formSchema>;

export default function NewDocument() {
	const { isDarkColorScheme } = useColorScheme();
	const { t } = useTranslation();
	const {
		addDocuments,
		isLoading,
		currentDocs,
		addCurrentDoc,
		removeCurrentDoc,
		clearCurrentDocs,
	} = useDocumentStore();

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting, isValid },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			documents: [],
		},
		mode: "onChange",
	});

	// Watch for changes in currentDocs and update form value
	useEffect(() => {
		setValue("documents", currentDocs, { shouldValidate: true });
	}, [currentDocs, setValue]);

	// Debug logs
	useEffect(() => {
		console.log("Form state:", {
			isValid,
			errors,
			isSubmitting,
			isLoading,
			currentDocsLength: currentDocs.length,
			name: watch("name"),
		});
	}, [
		isValid,
		errors,
		isSubmitting,
		isLoading,
		currentDocs.length,
		watch("name"),
	]);

	async function chooseDocument() {
		const result = await DocumentPicker.getDocumentAsync({
			type: ["application/pdf"],
			multiple: true,
		});

		if (result.canceled === false && result.assets) {
			for (const asset of result.assets) {
				addCurrentDoc({
					name: asset.name,
					type: "document",
					uri: asset.uri,
				});
			}
		}
	}

	const onSubmit = async (formData: FormData) => {
		try {
			console.log("Submitting form with data:", formData);
			await addDocuments();
			router.back();
		} catch (error) {
			console.error("Error creating documents:", error);
		}
	};

	const renderPreviewItem = ({
		item: doc,
		index,
	}: { item: (typeof currentDocs)[0]; index: number }) => (
		<Animated.View
			entering={SlideInRight.duration(300)
				.springify()
				.mass(0.2)
				.stiffness(100)
				.damping(10)
				.delay(index * 100)}
			exiting={SlideOutLeft.duration(300)
				.springify()
				.mass(0.2)
				.stiffness(100)
				.damping(10)
				.delay(index * 100)}
			layout={LinearTransition.springify()}
			className="w-full border border-border rounded-2xl p-2 flex-row items-start gap-3 mb-4 bg-muted/25 "
		>
			<View className="w-32 h-32 rounded-lg overflow-hidden">
				{doc.type === "picture" ? (
					<Image
						source={{ uri: doc.uri }}
						className="w-full h-full rounded-xl"
					/>
				) : doc.type === "document" ? (
					<View className="w-full h-full bg-secondary items-center justify-center">
						<Text className="text-muted-foreground text-xs">PDF</Text>
					</View>
				) : (
					<View className="w-full h-full bg-gray-100 items-center justify-center">
						<Text className="text-muted-foreground text-xs">Unknown</Text>
					</View>
				)}
			</View>
			<View className="flex-1 py-2">
				<Text className="font-medium">{doc.name}</Text>
				<Text className="text-muted-foreground text-sm capitalize">
					{t("type")}: {t(doc.type)}
				</Text>
			</View>
			<Button
				variant="ghost"
				size="icon"
				onPress={() => removeCurrentDoc(index)}
			>
				<IconX size={20} color={isDarkColorScheme ? "#fff" : "#000"} />
			</Button>
		</Animated.View>
	);

	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<Button
							variant={"ghost"}
							size={"icon"}
							onPress={() => {
								clearCurrentDocs();
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
			<BodyScrollView className="flex-1 w-full flex-col h-full space-y-4 px-4 relative">
				{Platform.OS === "android" && (
					<View className="w-full items-center">
						<View className="w-12 h-1 bg-muted rounded-full my-2" />
					</View>
				)}

				<View className="w-full flex-1 flex flex-col gap-6">
					<Controller
						control={control}
						name="name"
						render={({ field: { onChange, value } }) => (
							<View className="flex flex-col gap-2">
								<Input
									placeholder={t("document_name")}
									className="w-full"
									value={value}
									onChangeText={onChange}
								/>
								<AnimatePresence presenceAffectsLayout>
									{errors.name && (
										<MotiText
											from={{
												opacity: 0,
												height: 0,
											}}
											animate={{
												opacity: 1,
												height: "auto",
											}}
											exit={{
												opacity: 0,
												height: 0,
											}}
											layout={LinearTransition.springify()}
											className="text-red-500 text-sm"
										>
											{t(errors.name.message || "document_name_required")}
										</MotiText>
									)}
								</AnimatePresence>
							</View>
						)}
					/>

					{/* Preview Section */}
					<AnimatePresence>
						{currentDocs.length > 0 && (
							<MotiView
								className="w-full"
								from={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{
									type: "timing",
									duration: 300,
									easing: Easing.out(Easing.poly(4)),
								}}
							>
								<Animated.FlatList
									data={currentDocs}
									renderItem={renderPreviewItem}
									keyExtractor={(item) => item.uri || `doc-${Date.now()}`}
									scrollEnabled={false}
									itemLayoutAnimation={LinearTransition.easing(
										Easing.out(Easing.poly(4)),
									).duration(400)}
									className="w-full"
								/>
							</MotiView>
						)}
					</AnimatePresence>

					{errors.documents && (
						<Text className="text-red-500 text-sm mt-1">
							{t(errors.documents.message || "documents_required")}
						</Text>
					)}

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
									currentDocs.every((doc) => doc.type === "document") &&
									currentDocs.length > 0
										? "default"
										: "outline"
								}
							>
								<Text
									className="text-center"
									adjustsFontSizeToFit
									numberOfLines={1}
								>
									{currentDocs.every((doc) => doc.type === "document") &&
									currentDocs.length > 0
										? t("documents_selected")
										: t("documents")}
								</Text>
							</Button>
							<Button
								onPress={() => {
									trigger("impactLight");
									router.push("/(tabs)/documents/pick-image");
								}}
								size={"lg"}
								className="flex-1"
								variant={
									currentDocs.every((doc) => doc.type === "picture") &&
									currentDocs.length > 0
										? "default"
										: "outline"
								}
							>
								<Text>{t("pick_image")}</Text>
							</Button>
						</View>
						<Button
							className="w-full h-14"
							size="lg"
							onPress={() => {
								console.log("Button pressed");
								handleSubmit(onSubmit)();
							}}
							disabled={
								isLoading ||
								isSubmitting ||
								!isValid ||
								currentDocs.length === 0
							}
						>
							{isLoading ? (
								<ActivityIndicator color="white" />
							) : (
								<Text className="text-primary-foreground font-semibold">
									{t("create_documents")}
								</Text>
							)}
						</Button>
					</Animated.View>
				</View>
				<View className="h-12 pb-safe" />
			</BodyScrollView>
		</>
	);
}
