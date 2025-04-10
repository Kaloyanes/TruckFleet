import { View } from "react-native";
import React from "react";
import { IconCamera, IconFilePlus } from "@tabler/icons-react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import FabButton from "~/components/FabButton";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDocumentStore } from "~/stores/document-store";

export default function DocumentsPage() {
	const { isDarkColorScheme } = useColorScheme();
	const { t } = useTranslation();
	const { documents } = useDocumentStore();

	return (
		<View className="flex-1 items-center justify-center relative">
			{documents.length > 0 ? (
				<View className="flex-1 items-center justify-center">
					{documents.map((document) => (
						<View key={document.id}>
							<Text>{document.name}</Text>
						</View>
					))}
				</View>
			) : (
				<View className="flex-1 items-center justify-center">
					<Text>No documents found</Text>
				</View>
			)}

			<FabButton
				path="documents"
				icon={() => (
					<IconFilePlus size={28} color={isDarkColorScheme ? "#000" : "#fff"} />
				)}
				onPress={() => {
					router.push("/(tabs)/documents/new-document");
				}}
			/>
		</View>
	);
}
